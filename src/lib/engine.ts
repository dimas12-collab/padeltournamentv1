import { LINEUP_CATEGORIES, type Data, type LineupCategory, type Match, type MatchSet, type KnockoutScores, type Rules, type Standing } from './types';
export const active=<T extends {deletedAt?:string}>(items:T[])=>items.filter(x=>!x.deletedAt);
export function setWins(sets:MatchSet[]) { return sets.reduce((s,v)=>({a:s.a+(v.a>v.b?1:0),b:s.b+(v.b>v.a?1:0)}),{a:0,b:0}); }
export const emptyKnockoutScores=():KnockoutScores=>({BEGINNER:{status:'SCHEDULED',sets:[]},BRONZE:{status:'SCHEDULED',sets:[]},EXTRA:{status:'POSTPONED',sets:[]}});
const validRace=(set:MatchSet,target:number)=>{const high=Math.max(set.a,set.b),low=Math.min(set.a,set.b);return Number.isInteger(set.a)&&Number.isInteger(set.b)&&low>=0&&high===target&&low<target;};
export function validateSets(sets:MatchSet[],lineupCategory?:Match['lineupCategory']):string|undefined {
 if(lineupCategory==='EXTRA'&&sets.length!==1)return 'Complete one set for the Extra match.';
 if(lineupCategory&&lineupCategory!=='EXTRA'&&sets.length!==2)return 'Complete exactly two sets for the Beginner or Bronze match.';
 if(!lineupCategory&&(sets.length<2||sets.length>3))return 'Complete two or three sets before finishing.';
 for(let i=0;i<sets.length;i++) {const {a,b}=sets[i];if(!Number.isInteger(a)||!Number.isInteger(b)||a<0||b<0)return 'Scores must be whole numbers of zero or more.';const high=Math.max(a,b),low=Math.min(a,b);if(i<2?!(high===6&&low<=5):!(high===10&&low<=9))return `Set ${i+1}: ${i<2?'the regular set is first to 6; a one-point lead is enough.':'the deciding tiebreak is first to 10; a one-point lead is enough.'}`;}
 if(lineupCategory)return;
 const first=setWins(sets.slice(0,2));if((first.a===2||first.b===2)&&sets.length===3)return 'A third set is not played after a 2–0 result.';const result=setWins(sets);if(result.a!==2&&result.b!==2)return 'A team must win two sets.';
}
export function validateKnockoutSets(stage:Match['stage'],lineupCategory:LineupCategory,sets:MatchSet[]):string|undefined{
 if(lineupCategory==='EXTRA')return sets.length===1&&validRace(sets[0],6)?undefined:'Extra requires one race-to-6 set; a one-game lead is enough.';
 if(stage==='FINAL'){
  if(sets.length<2||sets.length>3||sets.some(set=>!validRace(set,6)))return 'Final Beginner and Bronze require two or three race-to-6 sets.';
  const first=setWins(sets.slice(0,2));if((first.a===2||first.b===2)&&sets.length!==2)return 'Do not play a third set after a 2–0 final result.';
  const result=setWins(sets);if(result.a!==2&&result.b!==2)return 'A final category must be won by two sets.';return;
 }
 if(sets.length<2||sets.length>3||sets.slice(0,2).some(set=>!validRace(set,6)))return 'Enter two race-to-6 sets for this knockout category.';
 const first=setWins(sets.slice(0,2));if(first.a===2||first.b===2)return sets.length===2?undefined:'Do not add a tiebreak after a 2–0 category result.';
 if(sets.length!==3||!validRace(sets[2],10))return 'A 1–1 category result requires a race-to-10 tiebreak.';return;
}
function points(r:Rules,won:boolean,setsWon:number,setsLost:number){return r.split?(won?(setsLost===0?r.win20:r.win21):(setsWon===0?r.loss02:r.loss12)):(won?r.win:r.loss);}
export function visibleMatches(d:Data):Match[]{const events=new Set(active(d.events).map(x=>x.id)),cats=new Set(active(d.categories).map(x=>x.id)),teams=new Set(active(d.teams).map(x=>x.id)),groups=new Set(active(d.groups).map(x=>x.id));return active(d.matches).filter(m=>events.has(m.eventId)&&cats.has(m.categoryId)&&(!m.groupId||groups.has(m.groupId))&&(!m.teamAId||teams.has(m.teamAId))&&(!m.teamBId||teams.has(m.teamBId)));}
const matchWinner=(match:Match)=>{const score=setWins(match.sets);return score.a===score.b?undefined:score.a>score.b?match.teamAId:match.teamBId;};
const lineupValue=(match:Match,teamId:string)=>{const winner=matchWinner(match);return !winner?0:winner===teamId?1:-1;};
function encounterMatches(d:Data,match:Match){return active(d.matches).filter(item=>item.eventId===match.eventId&&item.categoryId===match.categoryId&&item.groupId===match.groupId&&item.lineupCategory&&[item.teamAId,item.teamBId].includes(match.teamAId)&&[item.teamAId,item.teamBId].includes(match.teamBId));}
export function extraRequired(d:Data,match:Match){if(!match.groupId||!match.lineupCategory)return false;const lineups=encounterMatches(d,match);const beginner=lineups.find(item=>item.lineupCategory==='BEGINNER'),bronze=lineups.find(item=>item.lineupCategory==='BRONZE');if(!beginner||!bronze||beginner.status!=='FINISHED'||bronze.status!=='FINISHED')return false;return lineupValue(beginner,beginner.teamAId)+lineupValue(bronze,beginner.teamAId)===0;}
function syncExtraFlow(d:Data,match:Match){if(!match.groupId||!['BEGINNER','BRONZE'].includes(match.lineupCategory||''))return;const lineups=encounterMatches(d,match),extra=lineups.find(item=>item.lineupCategory==='EXTRA');if(!extra)return;if(extraRequired(d,match)){if(extra.status!=='FINISHED')extra.status='SCHEDULED';return;}const regular=lineups.filter(item=>item.lineupCategory!=='EXTRA');const complete=regular.length===2&&regular.every(item=>item.status==='FINISHED');extra.status=complete?'CANCELLED':'POSTPONED';extra.sets=[];extra.winnerId=undefined;}
export function standings(d:Data,groupId:string):Standing[]{
 const group=active(d.groups).find(g=>g.id===groupId);if(!group)return [];const category=active(d.categories).find(c=>c.id===group.categoryId);if(!category||!active(d.events).some(e=>e.id===group.eventId))return [];
 const rows:Standing[]=active(d.teams).filter(t=>t.groupId===groupId&&t.categoryId===group.categoryId).map(team=>({team,MP:0,W:0,L:0,SF:0,SA:0,SD:0,GF:0,GA:0,GD:0,PTS:0,H2H:0,tied:false}));const byId=new Map(rows.map(r=>[r.team.id,r]));
 const matches=visibleMatches(d).filter(m=>m.groupId===groupId&&m.stage==='GROUP'&&byId.has(m.teamAId)&&byId.has(m.teamBId));
 type Result={teamAId:string;teamBId:string;sfA:number;sfB:number;gfA:number;gfB:number;lineup:boolean;ptsA?:number;ptsB?:number};
 const results:Result[]=[];
 const encounters=new Map<string,Match[]>();
 for(const m of matches.filter(m=>m.lineupCategory)){const key=[m.teamAId,m.teamBId].sort().join(':');encounters.set(key,[...(encounters.get(key)||[]),m]);}
 for(const m of matches.filter(m=>!m.lineupCategory&&m.status==='FINISHED'&&!encounters.has([m.teamAId,m.teamBId].sort().join(':')))){const s=setWins(m.sets);results.push({teamAId:m.teamAId,teamBId:m.teamBId,sfA:s.a,sfB:s.b,gfA:m.sets.reduce((n,v)=>n+v.a,0),gfB:m.sets.reduce((n,v)=>n+v.b,0),lineup:false});}
 for(const encounter of encounters.values()){
  const beginner=encounter.find(m=>m.lineupCategory==='BEGINNER'),bronze=encounter.find(m=>m.lineupCategory==='BRONZE'),extra=encounter.find(m=>m.lineupCategory==='EXTRA');
  if(!beginner||!bronze||beginner.status!=='FINISHED'||bronze.status!=='FINISHED')continue;
  const teamAId=beginner.teamAId,teamBId=beginner.teamBId;const regularScore=lineupValue(beginner,teamAId)+lineupValue(bronze,teamAId);const needsExtra=regularScore===0;if(needsExtra&&extra?.status!=='FINISHED')continue;
  const counted=needsExtra?[beginner,bronze,extra!]:[beginner,bronze];const values=counted.map(item=>lineupValue(item,teamAId));const sfA=values.filter(value=>value>0).length,sfB=values.filter(value=>value<0).length;if(sfA===sfB)continue;let gfA=0,gfB=0;
  for(const m of counted){const same=m.teamAId===teamAId;gfA+=m.sets.reduce((n,v)=>n+(same?v.a:v.b),0);gfB+=m.sets.reduce((n,v)=>n+(same?v.b:v.a),0);}
  results.push({teamAId,teamBId,sfA,sfB,gfA,gfB,lineup:true,ptsA:Math.max(0,sfA-sfB),ptsB:Math.max(0,sfB-sfA)});
 }
 for(const result of results){for(const [id,isA] of [[result.teamAId,true],[result.teamBId,false]] as const){const row=byId.get(id)!;const sf=isA?result.sfA:result.sfB,sa=isA?result.sfB:result.sfA,won=sf>sa;row.MP++;row.W+=won?1:0;row.L+=won?0:1;row.SF+=sf;row.SA+=sa;row.GF+=isA?result.gfA:result.gfB;row.GA+=isA?result.gfB:result.gfA;row.PTS+=result.lineup?(isA?result.ptsA!:result.ptsB!):points(category.rules,won,sf,sa);}}
 const lineupGroup=encounters.size>0;
 for(const row of rows){row.GD=row.GF-row.GA;row.SD=lineupGroup?row.GD:row.SF-row.SA;const tiedIds=new Set(rows.filter(r=>r.PTS===row.PTS).map(r=>r.team.id));for(const result of results.filter(result=>tiedIds.has(result.teamAId)&&tiedIds.has(result.teamBId)&&(result.teamAId===row.team.id||result.teamBId===row.team.id))){const a=result.teamAId===row.team.id;row.H2H+=result.lineup?(a?result.ptsA!:result.ptsB!):points(category.rules,a?result.sfA>result.sfB:result.sfB>result.sfA,a?result.sfA:result.sfB,a?result.sfB:result.sfA);}}
 const criteria:Rules['tieBreak']=lineupGroup?['PTS','SD','H2H','W']:category.rules.tieBreak;const compare=(a:Standing,b:Standing)=>{const aUnplayed=a.MP===0,bUnplayed=b.MP===0;if(aUnplayed!==bUnplayed)return aUnplayed?1:-1;for(const key of criteria){if(a[key]!==b[key])return key==='L'?a.L-b.L:b[key]-a[key];}return 0;};rows.sort(compare);rows.forEach((r,i)=>{r.tied=r.MP>0&&((i>0&&compare(r,rows[i-1])===0)||(i<rows.length-1&&compare(r,rows[i+1])===0));});return rows;
}
export function createPlayoffBracket(d:Data,eventId:string,categoryId:string,prefix=crypto.randomUUID()):Match[]{
 const groups=active(d.groups).filter(group=>group.eventId===eventId&&group.categoryId===categoryId).sort((a,b)=>a.name.localeCompare(b.name));
 if(groups.length!==2)throw Error('The playoff format requires exactly two groups.');
 const [groupA,groupB]=groups;const rankedA=standings(d,groupA.id);const rankedB=standings(d,groupB.id);
 if(rankedA.length<3||rankedB.length<3)throw Error('Each group needs at least three teams before creating the playoff bracket.');
 const [a1,a2,a3]=rankedA.map(row=>row.team.id),[b1,b2,b3]=rankedB.map(row=>row.team.id);
 const make=(key:string,name:string,stage:Match['stage'],teamAId='',teamBId='',next?:string,nextSlot?:'A'|'B',loserNext?:string,loserSlot?:'A'|'B'):Match=>({id:`${prefix}-${key}`,name,eventId,categoryId,stage,teamAId,teamBId,status:'SCHEDULED',sets:[],knockoutScores:emptyKnockoutScores(),nextMatchId:next?`${prefix}-${next}`:undefined,nextSlot,nextLoserMatchId:loserNext?`${prefix}-${loserNext}`:undefined,nextLoserSlot:loserSlot});
 return [
  make('final','Grand final','FINAL'),
  make('third','Third-place match','THIRD_PLACE'),
  make('sf-a',`${groupA.name} #1 vs winner ${groupB.name} quarter-final`,'SEMI_FINAL',a1,'','final','A','third','A'),
  make('sf-b',`${groupB.name} #1 vs winner ${groupA.name} quarter-final`,'SEMI_FINAL',b1,'','final','B','third','B'),
  make('playoff-a',`${groupA.name} playoff · #2 vs #3`,'QUARTER_FINAL',a2,a3,'sf-b','B'),
  make('playoff-b',`${groupB.name} playoff · #2 vs #3`,'QUARTER_FINAL',b2,b3,'sf-a','B'),
 ];
}
export function validateMatch(d:Data,m:Match){const cat=active(d.categories).find(c=>c.id===m.categoryId&&c.eventId===m.eventId);if(!cat)throw Error('Choose a category in this event.');if(m.teamAId&&m.teamAId===m.teamBId)throw Error('A team cannot play itself.');if(m.stage==='GROUP'&&(!m.groupId||!m.teamAId||!m.teamBId))throw Error('Group matches need a group and two teams.');if(m.groupId&&!active(d.groups).some(g=>g.id===m.groupId&&g.categoryId===m.categoryId))throw Error('The group must belong to the selected category.');for(const id of [m.teamAId,m.teamBId].filter(Boolean)){const t=active(d.teams).find(t=>t.id===id);if(!t||t.categoryId!==m.categoryId||t.eventId!==m.eventId)throw Error('Both teams must belong to this category.');if(m.stage==='GROUP'&&t.groupId!==m.groupId)throw Error('Both teams must belong to the selected group.');}if(m.lineupCategory&&active(d.matches).some(x=>x.id!==m.id&&x.groupId===m.groupId&&x.lineupCategory===m.lineupCategory&&[x.teamAId,x.teamBId].includes(m.teamAId)&&[x.teamAId,x.teamBId].includes(m.teamBId)))throw Error(`A ${m.lineupCategory.toLowerCase()} match already exists for these teams.`);if(m.courtId&&!active(d.courts).some(c=>c.id===m.courtId&&c.eventId===m.eventId&&c.active))throw Error('Choose an active court in this event.');}
export function scheduleWarnings(d:Data,m:Match){if(!m.scheduledAt)return [];const same=visibleMatches(d).filter(x=>x.id!==m.id&&x.eventId===m.eventId&&x.scheduledAt&&x.status!=='CANCELLED'&&Math.abs(Date.parse(x.scheduledAt)-Date.parse(m.scheduledAt!))<3600000);return [...(m.courtId&&same.some(x=>x.courtId===m.courtId)?['This court has another match within 60 minutes.']:[]),...(same.some(x=>[x.teamAId,x.teamBId].some(t=>!!t&&[m.teamAId,m.teamBId].includes(t)))?['A team has another match within 60 minutes.']:[])];}
const progressionLinks=(match:Match)=>[[match.nextMatchId,match.nextSlot],[match.nextLoserMatchId,match.nextLoserSlot]] as const;
export function descendants(d:Data,id:string){const ids:string[]=[];const visit=(source?:Match)=>{if(!source)return;for(const [nextId] of progressionLinks(source)){if(!nextId||ids.includes(nextId))continue;ids.push(nextId);visit(d.matches.find(match=>match.id===nextId));}};visit(d.matches.find(match=>match.id===id));return ids;}
function resetMatchResult(match:Match){match.winnerId=undefined;match.sets=[];match.status='SCHEDULED';if(match.knockoutScores)match.knockoutScores=emptyKnockoutScores();}
export function clearProgression(d:Data,id:string){const visited=new Set<string>();const clear=(source?:Match)=>{if(!source)return;for(const [nextId,slot] of progressionLinks(source)){if(!nextId||visited.has(nextId))continue;visited.add(nextId);const next=d.matches.find(match=>match.id===nextId);if(!next)continue;clear(next);if(slot==='A')next.teamAId='';else if(slot==='B')next.teamBId='';resetMatchResult(next);}};clear(d.matches.find(match=>match.id===id));}
function assignProgression(d:Data,match:Match){if(!match.winnerId)return;const loserId=match.winnerId===match.teamAId?match.teamBId:match.teamAId;for(const [targetId,slot,teamId] of [[match.nextMatchId,match.nextSlot,match.winnerId],[match.nextLoserMatchId,match.nextLoserSlot,loserId]] as const){const target=d.matches.find(item=>item.id===targetId);if(!target||!slot)continue;if(slot==='A')target.teamAId=teamId;else target.teamBId=teamId;}}
export function updateScore(d:Data,id:string,sets:MatchSet[],status:Match['status']){const m=d.matches.find(x=>x.id===id);if(!m)throw Error('Match not found.');if(m.knockoutScores)throw Error('Use the category score controls for this knockout encounter.');if(m.deletedAt)throw Error('Restore this match first.');if(m.lineupCategory==='EXTRA'&&status!=='SCHEDULED'&&!extraRequired(d,m))throw Error('Extra is available only when the Beginner and Bronze category score is tied.');if(status==='FINISHED'){validateMatch(d,m);if(!m.teamAId||!m.teamBId)throw Error('Both participants must be known.');const error=validateSets(sets,m.lineupCategory);if(error)throw Error(error);}else if(sets.some(s=>!Number.isInteger(s.a)||!Number.isInteger(s.b)||s.a<0||s.b<0))throw Error('Scores must be non-negative whole numbers.');clearProgression(d,id);m.sets=sets;m.status=status;const wins=setWins(sets);m.winnerId=status==='FINISHED'?(wins.a===wins.b?undefined:wins.a>wins.b?m.teamAId:m.teamBId):undefined;syncExtraFlow(d,m);assignProgression(d,m);return m;}
export function updateKnockoutScore(d:Data,id:string,lineupCategory:LineupCategory,sets:MatchSet[],status:Match['status']){
 const match=d.matches.find(item=>item.id===id);if(!match)throw Error('Match not found.');if(!match.knockoutScores)throw Error('This match does not use knockout category scoring.');if(match.deletedAt)throw Error('Restore this match first.');if(!match.teamAId||!match.teamBId)throw Error('Both participants must be known.');
 if(lineupCategory==='EXTRA'&&status!=='SCHEDULED'&&match.knockoutScores.EXTRA.status==='POSTPONED')throw Error('Extra is available only after Beginner and Bronze are won by different teams.');
 if(status==='FINISHED'){const error=validateKnockoutSets(match.stage,lineupCategory,sets);if(error)throw Error(error);}else if(sets.some(set=>!Number.isInteger(set.a)||!Number.isInteger(set.b)||set.a<0||set.b<0))throw Error('Scores must be non-negative whole numbers.');
 clearProgression(d,id);const result=match.knockoutScores[lineupCategory];result.sets=sets;result.status=status;const wins=setWins(sets);result.winnerId=status==='FINISHED'?(wins.a>wins.b?match.teamAId:match.teamBId):undefined;
 const beginner=match.knockoutScores.BEGINNER,bronze=match.knockoutScores.BRONZE,extra=match.knockoutScores.EXTRA;match.winnerId=undefined;
 if(beginner.status==='FINISHED'&&bronze.status==='FINISHED'){
  if(beginner.winnerId===bronze.winnerId){extra.status='CANCELLED';extra.sets=[];extra.winnerId=undefined;match.winnerId=beginner.winnerId;}
  else {if(extra.status==='POSTPONED'||extra.status==='CANCELLED')extra.status='SCHEDULED';if(extra.status==='FINISHED')match.winnerId=extra.winnerId;}
 }else {extra.status='POSTPONED';extra.sets=[];extra.winnerId=undefined;}
 match.status=match.winnerId?'FINISHED':LINEUP_CATEGORIES.some(category=>{const item=match.knockoutScores![category];return item.status==='LIVE'||item.status==='FINISHED';})?'LIVE':'SCHEDULED';assignProgression(d,match);return match;
}
export function convertPlayoffBracket(d:Data,eventId:string,categoryId:string,prefix=crypto.randomUUID()):Match[]{
 const existing=active(d.matches).filter(match=>match.eventId===eventId&&match.categoryId===categoryId&&['QUARTER_FINAL','SEMI_FINAL','FINAL'].includes(match.stage));
 if(!existing.length)throw Error('Create the bracket before enabling knockout category scoring.');
 if(existing.some(match=>match.status!=='SCHEDULED'||match.sets.length||match.winnerId))throw Error('Only an unplayed bracket can be converted automatically.');
 const quarterfinals=existing.filter(match=>match.stage==='QUARTER_FINAL'),semifinals=existing.filter(match=>match.stage==='SEMI_FINAL'),final=existing.find(match=>match.stage==='FINAL');if(quarterfinals.length!==2||semifinals.length!==2||!final)throw Error('The existing bracket needs two quarter-finals, two semifinals, and one final.');
 const third:Match={id:`${prefix}-third`,name:'Third-place match',eventId,categoryId,stage:'THIRD_PLACE',teamAId:'',teamBId:'',status:'SCHEDULED',sets:[],knockoutScores:emptyKnockoutScores()};
 return [...existing.map(match=>({...match,knockoutScores:emptyKnockoutScores(),...(match.stage==='SEMI_FINAL'?{nextLoserMatchId:third.id,nextLoserSlot:match===semifinals[0]?'A' as const:'B' as const}:{})})),third];
}
