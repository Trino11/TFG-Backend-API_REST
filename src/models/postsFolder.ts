import { ObjectId } from "mongodb";
import { PostDocument } from "./postDocument";

export interface PostsFolder {
    fid:string,
    name: string,
    info?:string,
    posts?: [string],
    folders?: [string],
    parent?:ObjectId
}