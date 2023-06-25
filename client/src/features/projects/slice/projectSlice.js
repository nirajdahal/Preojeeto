import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import projectService from "../services/ProjectService";
const initialState = {
    project: {},
    projects: [],
    stages: [],
    stage: {},
    task: {},
    updatedTask: {},
    isError: false,
    isSuccess: false,
    isProjectDelete: false,
    isLoading: false,
    message: "",
};
const setErrorFromResponse = (error) => {
    let message = ""
    if (error.response) {
        message = error.response.data.message
    }
    else {
        message = error.message
    }
    return message
}
// create Project
export const createProject = createAsyncThunk(
    "project/create",
    async (data, thunkAPI) => {
        try {
            return await projectService.createProject(data);
        } catch (error) {
            const message = setErrorFromResponse(error)
            return thunkAPI.rejectWithValue(message)
        }
    }
);
// edit Project
export const editProject = createAsyncThunk(
    "project/edit",
    async ({ paramId, data }, thunkAPI) => {
        try {
            return await projectService.editProject(paramId, data);
        } catch (error) {
            const message = setErrorFromResponse(error)
            return thunkAPI.rejectWithValue(message)
        }
    }
);
// get all the project related the user
export const getTeamProject = createAsyncThunk(
    "project/getTeamProject",
    async (_, thunkAPI) => {
        try {
            return await projectService.getAllTeamProjects();
        } catch (error) {
            const message = setErrorFromResponse(error)
            return thunkAPI.rejectWithValue(message)
        }
    }
);
// Delete Project
export const deleteProject = createAsyncThunk("project/deleteProject", async (projectId, thunkAPI) => {
    try {
        return await projectService.deleteProject(projectId)
    } catch (error) {
        const message = setErrorFromResponse(error)
        return thunkAPI.rejectWithValue(message);
    }
});
// Get stages By Project Id
export const getStages = createAsyncThunk("project/getStages", async (projectId, thunkAPI) => {
    try {
        return await projectService.getStages(projectId)
    } catch (error) {
        const message = setErrorFromResponse(error)
        return thunkAPI.rejectWithValue(message);
    }
});
// Create stage
export const createStage = createAsyncThunk(
    "project/createStage",
    async ({ projectId, data }, thunkAPI) => {
        try {
            return await projectService.createStage(projectId, data);
        } catch (error) {
            const message = setErrorFromResponse(error)
            return thunkAPI.rejectWithValue(message);
        }
    }
);
// Update task
export const addTask = createAsyncThunk(
    "project/addTask",
    async ({ stageId, data }, thunkAPI) => {
        try {
            return await projectService.createTask(stageId, data);
        } catch (error) {
            const message = setErrorFromResponse(error)
            return thunkAPI.rejectWithValue(message);
        }
    }
);
// Update task
export const updateTask = createAsyncThunk(
    "project/updateTask",
    async ({ paramIds, data }, thunkAPI) => {
        try {
            return await projectService.updateTask(paramIds, data);
        } catch (error) {
            const message = setErrorFromResponse(error)
            return thunkAPI.rejectWithValue(message);
        }
    }
);
// Delete task
export const deleteTask = createAsyncThunk(
    "project/deleteTask",
    async (paramIds, thunkAPI) => {
        try {
            return await projectService.deleteTask(paramIds);
        } catch (error) {
            const message = setErrorFromResponse(error)
            return thunkAPI.rejectWithValue(message);
        }
    }
);
const projectSlice = createSlice({
    name: "project",
    initialState,
    reducers: {
        RESET(state) {
            state.project = {}
            state.stages = []
            state.task = {}
            state.updatedTask = {}
            state.isError = false
            state.isSuccess = false
            state.isLoading = false
            state.message = ""
        },
        RESET_TASK(state) {
            state.projects = []
            state.project = {}
            state.isProjectDelete = false
            state.stage = {}
            state.stages = []
            state.task = {}
            state.updatedTask = {}
            state.isError = false
            state.isSuccess = false
            state.isLoading = false
            state.message = ""
        }
    },
    extraReducers: (builder) => {
        builder
            // Get stages
            .addCase(getStages.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getStages.fulfilled, (state, action) => {
                state.isLoading = false
                state.isSuccess = true
                state.stages = action.payload.data
                state.message = action.payload.message
                toast.success("All tasks")
            })
            .addCase(getStages.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
                toast.error(action.payload);
            })
            // get Team Project
            .addCase(getTeamProject.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getTeamProject.fulfilled, (state, action) => {
                state.isLoading = false
                state.isSuccess = true
                state.projects = action.payload.data
                state.message = action.payload.message
            })
            .addCase(getTeamProject.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
                toast.error(action.payload);
            })
            .addCase(deleteProject.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(deleteProject.fulfilled, (state, action) => {
                state.isLoading = false
                state.isSuccess = true
                state.isProjectDelete = true
                state.message = action.payload.message
                toast.success("Project Deleted Successfully")
            })
            .addCase(deleteProject.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
                toast.error(action.payload);
            })
            .addCase(createStage.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(createStage.fulfilled, (state, action) => {
                state.isLoading = false
                state.isSuccess = true
                state.stage = action.payload.data
                state.message = action.payload.message
                toast.success("Stage Created Succesfully")
            })
            .addCase(createStage.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
                toast.error(action.payload);
            })
            .addCase(createProject.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(createProject.fulfilled, (state, action) => {
                state.isLoading = false
                state.isSuccess = true
                state.project = action.payload.data
                state.message = action.payload.message
                toast.success("Project Created Succesfully")
            })
            .addCase(createProject.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
                toast.error(action.payload);
            })
            .addCase(editProject.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(editProject.fulfilled, (state, action) => {
                state.isLoading = false
                state.isSuccess = true
                state.project = action.payload.data
                state.message = action.payload.message
                toast.success("Project Edit Succesfully")
            })
            .addCase(editProject.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
                toast.error(action.payload);
            })
            .addCase(addTask.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(addTask.fulfilled, (state, action) => {
                state.isLoading = false
                state.isSuccess = true
                state.task = action.payload.data
                state.message = action.payload.message
                toast.success("Task Created Succesfully")
            })
            .addCase(addTask.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
                toast.error(action.payload);
            })
            .addCase(updateTask.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(updateTask.fulfilled, (state, action) => {
                state.isLoading = false
                state.isSuccess = true
                state.updatedTask = action.payload.data
                state.message = action.payload.message
                toast.success("Updated Task Succesfully")
            })
            .addCase(updateTask.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
                toast.error(action.payload);
            })
            .addCase(deleteTask.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(deleteTask.fulfilled, (state, action) => {
                state.isLoading = false
                state.message = action.payload.message
                toast.success("Task Deleted Succesfully")
            })
            .addCase(deleteTask.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
                toast.error(action.payload);
            })
    },
})
export const { RESET, RESET_TASK } =
    projectSlice.actions;
// export const selectUser = (state) => state.project.user;
export default projectSlice.reducer;
