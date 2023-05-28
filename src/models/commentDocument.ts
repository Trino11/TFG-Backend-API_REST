import { ObjectId } from "mongodb"

export interface CommentDocument {
cid:string,
body:string,
public_date:Date,
edit_date?:Date,
edited:boolean
parent?:ObjectId,
author?:ObjectId
}