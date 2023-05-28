export interface CompleteUserModel {
    [key: string]: string | undefined | number,
    uid?:'uid',
    name?: 'name',
    lastname?: 'lastname',
    alias?: 'alias',
    ppic?: 'ppic',
    tag?: 'tag' | number,
    newsletter?: 'newsletter',
    phone?: 'phone',
    birthday?: 'birthday'
}