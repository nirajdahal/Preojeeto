import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { updateTask } from "../../slice/projectSlice";
import { configColor } from "../../utils/ConfigColor";
import authService from "../../../user/services/UserService";
import { socketGetUsers, socketSendUserNotification } from "../../../../socket/Socket";
import Select from 'react-select';
import { useLocation, useNavigate } from "react-router";
import { RESET } from "../../slice/projectSlice";
function EditTask() {
    const dispatch = useDispatch()
    const navigate = useNavigate();
    const location = useLocation()
    const taskToEdit = location.state
    const [selectedTask, setSelectedTask] = useState(taskToEdit)
    const [allTeamMembers, setAllTeamMembers] = useState(null)
    const [activeUsers, setActiveUsers] = useState(null)
    const [selectedType, setSelectedType] = useState('')
    const [selectedTitle, setSelectedTitle] = useState('')
    const [selectedDescription, setSelectedDescription] = useState('')
    const [selectedAssignee, setSelectedAssignee] = useState('')
    const [selectedStage, setSelectedStageId] = useState('')
    const [selectedPriority, setSelectedPriority] = useState('')
    const [multiSelectOption, setMultiSelectOption] = useState([])
    const [selectedMultiOption, setSelectedMultiOption] = useState(null);
    const { updatedTask, isSuccess } = useSelector(
        (state) => state.project
    )
    useEffect(() => {
        if (updatedTask && isSuccess) {
            // send notification only to the users modified otherwise dont send notification
            if (updatedTask.assignees) {
                const newAssignees = updatedTask.assignees.filter(userId => {
                    if (!selectedTask.assignees) {
                        return true;
                    }
                    return !selectedTask.assignees.includes(userId);
                })
                newAssignees.forEach(assignee => {
                    let type = "ticket-added"
                    socketSendUserNotification(assignee, type)
                });
            }
            // else if(updateTask.assignee && !selectedTask.assignee){
            // }
            setSelectedTask(updatedTask)
            dispatch(RESET())
        }
    }, [updatedTask])
    useEffect(() => {
        socketGetUsers((data) => {
            setActiveUsers(() => data.map(obj => obj.userId));
        })
    }, [socketGetUsers]);
    useEffect(() => {
        if (!taskToEdit) {
            window.location.href = "/"
        }
        const {
            assignees,
            description,
            name,
            priority,
            stage,
            type
        } = selectedTask
        setSelectedAssignee(assignees)
        setSelectedDescription(description)
        setSelectedPriority(priority[0])
        setSelectedTitle(name)
        setSelectedType(type[0])
        setSelectedStageId(stage)
        const getAllTeamList = async () => {
            const data = await authService.getTeamMembers();
            setAllTeamMembers(data.data)
            // configure multi select options
            const options = data.data.map(team => ({
                value: team._id,
                label: team.name
            }))
            setMultiSelectOption(() => options)
        }
        getAllTeamList()
        console.log(multiSelectOption, selectedTask.assignees)
    }, [])
    const extractTeamImage = (assignee) => {
        if (!assignee) {
            return null
        }
        if (allTeamMembers) {
            const teams = allTeamMembers.find(team => team._id === assignee)
            if (teams) {
                return teams.photo
            }
            else {
                return null
            }
        }
    }
    const checkUserStatus = (assignee) => {
        // console.log("activeusers", activeUsers)
        if (activeUsers) {
            return activeUsers.includes(assignee)
        }
        return false
    }
    const submitForm = async (e) => {
        e.preventDefault()
        const paramIds = {
            stageId: selectedStage,
            id: selectedTask._id
        }
        const data = {
            description: selectedDescription,
            name: selectedTitle,
            priority: [selectedPriority],
            stage: selectedStage,
            type: [selectedType],
            assignees: selectedMultiOption.map(option => option.value)
        }
        dispatch(updateTask({ paramIds, data }));
    }
    return (
        <>
            {allTeamMembers &&
                <form onSubmit={(e) => submitForm(e)}>
                    <div className=" cursor-auto min-h-screen ">
                        <div className=" grid gap-4 h-100 modal-box w-12/12 max-w-5xl p-8">
                            <label onClick={() => navigate('/app/kanban')} htmlFor="editTask" className="btn btn-sm btn-circle absolute right-2 top-2">✕</label>
                            <h3 className="font-bold text-lg">Edit Task</h3>
                            <div className={`form-control `}>
                                <label className="label">
                                    <span className={"label-text text-base-content "}>Name</span>
                                </label>
                                <input defaultValue={selectedTask.name} onChange={(e) => setSelectedTitle(e.target.value)} type='text' className="input  input-bordered w-full " />
                            </div>
                            <div className={`form-control w-full`}>
                                <label className="label">
                                    <span className={"label-text text-base-content "}>Description</span>
                                </label>
                                <textarea defaultValue={selectedTask.description} type='text' onChange={(e) => setSelectedDescription(e.target.value)} className="textarea  textarea-bordered w-full " />
                            </div>
                            <div className="flex justify-start">
                                <div className={`form-control w-1/2`}  >
                                    <label className="label">
                                        <span className={"label-text text-base-content w-full "}>Type &nbsp;
                                            <span className={`badge ${configColor(selectedType)} badge-outline mr-2`} >{selectedType}</span>
                                        </span>
                                    </label>
                                    <select className="select select-bordered w-full max-w-xs" onChange={e => setSelectedType(e.target.value)}>
                                        <option selected={true} value="Change" disabled >Change</option>
                                        <option value={'Bug'}>Bug</option>
                                        <option value={'New Feature'}>New Feature</option>
                                        <option value={'Update'}>Update</option>
                                        <option value={'Others'}>Others</option>
                                    </select>
                                </div>
                                <div className={`form-control w-1/2`}>
                                    <label className="label">
                                        <span className={"label-text text-base-content w-full "}>Priority &nbsp;
                                            <span className={`badge ${configColor(selectedPriority)} badge-outline mr-2`} >{selectedPriority}</span>
                                        </span>
                                    </label>
                                    <select className="select select-bordered w-full max-w-xs" onChange={e => setSelectedPriority(e.target.value)}>
                                        <option selected={true} value="Change" disabled >Change</option>
                                        <option value={'Low'}>Low</option>
                                        <option value={'Medium'}>Medium</option>
                                        <option value={'High'}>High</option>
                                        <option value={'Urgent'}>Urgent</option>
                                    </select>
                                </div>
                            </div>
                            <div className={`form-control w-full`}>
                                <label className="label">
                                    <span className={"label-text text-base-content "}>Assigned Users</span>
                                </label>
                            </div>
                            <div>
                                {selectedTask.assignees.map(assignee => {
                                    return (
                                        extractTeamImage(assignee) !== null && <>
                                            <div key={assignee} className={`avatar ${checkUserStatus(assignee) ? 'online' : 'offline'}`}>
                                                <div className="rounded-full w-16">
                                                    <img src={`${extractTeamImage(assignee)}`} />
                                                </div>
                                            </div>
                                        </>
                                    )
                                })}
                            </div>
                            <div className={`form-control w-full`}>
                                <label className="label">
                                    <span className={"label-text text-base-content "}>Change Assignment</span>
                                </label>
                            </div>
                            <div className="z-10">
                                <Select
                                    defaultValue={multiSelectOption.filter(option => selectedTask.assignees.includes(option.value))}
                                    isMulti
                                    name="Team"
                                    options={multiSelectOption}
                                    className="basic-multi-select"
                                    classNamePrefix="select"
                                    onChange={setSelectedMultiOption}
                                />
                            </div>
                            <div className="modal-action">
                                <button type="submit" htmlFor="my-modal-5" className="btn">Update</button>
                            </div>
                        </div>
                    </div>
                </form>
            }
        </>
    )
}
export default EditTask;