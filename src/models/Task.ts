import { Document, Model, model, Schema, deleteModel, LeanDocument } from 'mongoose';

const TaskSchemaFields = new Schema<ITaskModel>({
    task: {
        type: String,
        required: true,
        trim: true,
    },
    complete: {
        type: Boolean,
        default: false,
    },
});

export interface ITask {
    task: string;
    complete: boolean;
}

export interface ITaskModel extends ITask, Document {}

const Task = model<ITaskModel>('Task', TaskSchemaFields);

export default Task;
