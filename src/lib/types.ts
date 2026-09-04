export type Role = 'SUPER_ADMIN' | 'EVENT_ADMIN' | 'SCOREKEEPER';
export type MatchStatus = 'SCHEDULED' | 'LIVE' | 'FINISHED' | 'POSTPONED' | 'CANCELLED';
export type Stage = 'GROUP' | 'QUARTER_FINAL' | 'SEMI_FINAL' | 'FINAL' | 'OTHER';
export interface Base { id:string; name:string; deletedAt?:string; createdAt?:string; }
export interface Event extends Base { slug:string; organizer:string; venue:string; description:string; startDate:string; endDate:string; status:'UPCOMING'|'ONGOING'|'FINISHED'; logo?:string; banner?:string; }
export interface Rules { win:number; loss:number; split:boolean; win20:number; win21:number; loss12:number; loss02:number; tieBreak:('PTS'|'H2H'|'SD'|'GD'|'GF')[]; }
export interface Category extends Base { eventId:string; rules:Rules; }
export interface Group extends Base { eventId:string; categoryId:string; }
export interface Team extends Base { eventId:string; categoryId:string; groupId?:string; seed?:number; logo?:string; }
export interface Player extends Base { eventId:string; teamId:string; nickname?:string; phone?:string; email?:string; photo?:string; }
export interface Court extends Base { eventId:string; active:boolean; sortOrder:number; }
export interface MatchSet { a:number; b:number; }
export interface Match extends Base { eventId:string; categoryId:string; groupId?:string; stage:Stage; teamAId:string; teamBId:string; courtId?:string; scheduledAt?:string; status:MatchStatus; sets:MatchSet[]; winnerId?:string; notes?:string; nextMatchId?:string; nextSlot?:'A'|'B'; }
export interface User extends Base { email:string; role:Role; eventId:string; active:boolean; }
export interface Audit extends Base { userId:string; userName:string; action:string; entity:string; entityId:string; timestamp:string; before?:string; after?:string; }
export interface Data { events:Event[]; categories:Category[]; groups:Group[]; teams:Team[]; players:Player[]; courts:Court[]; matches:Match[]; users:User[]; audits:Audit[]; }
export type Entity = Exclude<keyof Data,'audits'>;
export type RecordItem = Event|Category|Group|Team|Player|Court|Match|User;
export interface SessionAdapter { userId:string|null; signIn:(id:string)=>void; signOut:()=>void; }
export interface TournamentRepository { data:Data; save:(entity:Entity,record:RecordItem)=>void; remove:(entity:Entity,id:string,permanent?:boolean)=>void; restore:(entity:Entity,id:string)=>void; }
export interface Standing { team:Team; MP:number; W:number; L:number; SF:number; SA:number; SD:number; GF:number; GA:number; GD:number; PTS:number; H2H:number; tied:boolean; }
