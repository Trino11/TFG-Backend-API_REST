import { ObjectId } from "mongodb"

export interface PostDocument {
pid?:string,
title:string,
body:any,
plain_body?:string,
tags?:[string],
public_date?:Date,
edit_date?:Date,
edited:boolean
parent?:ObjectId,
author?:ObjectId
}