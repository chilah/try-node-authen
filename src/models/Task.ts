import { Document, Model, model, Schema, deleteModel, LeanDocument } from 'mongoose';

const TaskSchemaFields = new Schema<TaskDocument, TaskModel>({
    task: {
        type: String,
        required: true,
        trim: true,
    },
    complete: {
        type: Boolean,
        default: false,
    },
    owner: {
        type: Schema.Types.ObjectId,
        require: true,
        ref: 'User',
    },
});

export interface ITask {
    task: string;
    complete: boolean;
    owner: string;
}

export interface TaskDocument extends ITask, Document {}

export interface TaskModel extends Model<TaskDocument> {}

const Task = model<TaskDocument, TaskModel>('Task', TaskSchemaFields);

export default Task;
