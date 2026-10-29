import assert from 'node:assert/strict';
import { buildStatisticsParams, buildStatisticsQueries, loadStatisticsDashboard, normalizeStatisticsDashboard, normalizeStatisticsOptions, statisticsDay, statisticsPeriodLabel, statisticsRequest, RESOURCE_TYPES } from '../src/productionStats.js';
import { applyBrandName } from '../src/brand.js';
import { workspaceRefreshOverrides } from './workspace-refresh-overrides.mjs';
const list = (values) => values.map((value) => ({value,label:value,unit:'个'}));
const options = normalizeStatisticsOptions({
 version:1, timezone:'Asia/Shanghai', max_days:366,
 scopes:list(['team','personal']), periods:list(['today','yesterday','last7','last30','custom']), group_by:list(['day','member']), resource_types:list(RESOURCE_TYPES),
 members:[{value:12,label:'Current member',is_self:true},{value:13,label:'Teammate'}],
 defaults:{scope:'team',period:'today',group_by:'day',resource_types:RESOURCE_TYPES},
});
const day = '2026-10-29';
const team = buildStatisticsParams({},options,day);
assert.deepEqual(team,{scope:'team',period:'today',group_by:'day',resource_types:RESOURCE_TYPES.join(',')});
assert.equal(buildStatisticsParams({scope:'team',user_id:99},options,day).user_id,undefined);
assert.equal(buildStatisticsParams({scope:'personal',user_id:'13',period:'last7'},options,day).user_id,13);
assert.throws(() => buildStatisticsParams({scope:'personal',user_id:99},options,day),{kind:'forbidden'});
for(const filters of [{resource_types:[]},{resource_types:['unknown']},{resource_types:['video','video']},{date:'2026-10-30'},{date:'2026-02-29'},{date:'2026-99-99'},{date:day,period:'today'},{period:'custom',start_date:'2025-01-01',end_date:day},{period:'custom',start_date:day},{period:'custom',start_date:day,end_date:'2026-10-28'}]) {
 assert.throws(() => buildStatisticsParams(filters,options,day),{kind:'validation'});
}
assert.deepEqual(buildStatisticsParams({date:'2026-10-28',resource_types:['video']},options,day),{scope:'team',group_by:'day',resource_types:'video',date:'2026-10-28'});
assert.equal(buildStatisticsParams({period:'custom',start_date:'2025-10-29',end_date:day},options,day).end_date,day);
assert.equal(statisticsDay(new Date('2026-10-28T16:00:00Z')),day);
assert.equal(statisticsDay(new Date('2026-10-28T15:59:59Z')),'2026-10-28');
const dashboard = {version:1,timezone:'Asia/Shanghai',start_date:day,end_date:day,group_by:'day',summary:RESOURCE_TYPES.map((value) => ({value,period_count:0,total_count:0})),series:[{date:day,counts:Object.fromEntries(RESOURCE_TYPES.map((value)=>[value,0]))}]};
assert.equal(normalizeStatisticsDashboard(dashboard,RESOURCE_TYPES).summary[0].total_count,0);
assert.throws(()=>normalizeStatisticsDashboard({...dashboard,summary:dashboard.summary.slice(1)},RESOURCE_TYPES));
assert.throws(()=>normalizeStatisticsDashboard({...dashboard,summary:dashboard.summary.map((row,i)=>i===0?{...row,total_count:null}:row)},RESOURCE_TYPES));
assert.equal(statisticsPeriodLabel(dashboard,day),'今日完成');
assert.equal(statisticsPeriodLabel({...dashboard,start_date:'2026-10-28',end_date:'2026-10-28'},day),'当日完成');
assert.equal(statisticsPeriodLabel({...dashboard,start_date:'2026-10-01'},day),'期间完成');
for(const [code,kind] of [[401,'auth'],[403,'forbidden'],[400,'validation'],[500,'unavailable']]) {
 await assert.rejects(statisticsRequest('/api/statistics/dashboard',team,async()=>({ok:true,status:200,raw:{code},data:dashboard})),{kind});
}
await assert.rejects(statisticsRequest('/api/statistics/dashboard',team,async()=>({ok:true,status:200,data:dashboard})),{kind:'unavailable'});
let calls=0;
const result=await loadStatisticsDashboard(team,async(path,{params})=>{
 calls++;assert.equal(path,'/api/statistics/dashboard');assert.deepEqual(params,team);
 return {ok:true,status:200,raw:{code:200},data:dashboard};
});
assert.equal(calls,1);assert.equal(result.summary.length,7);
assert.equal(normalizeStatisticsDashboard({...dashboard,group_by:'member',series:[]},RESOURCE_TYPES).series.length,0);
assert.equal(applyBrandName('Kali · Yixiu','zh-CN'),'喀理');
assert.equal(Object.keys(workspaceRefreshOverrides).length,24);
const history = buildStatisticsQueries({scope:'personal',user_id:13,period:'last30',group_by:'member',resource_types:['image']},options,day);
assert.deepEqual(history.main,{scope:'personal',user_id:13,period:'last30',group_by:'member',resource_types:'image'});
assert.deepEqual(history.today,{scope:'personal',user_id:13,period:'today',group_by:'day',resource_types:'video'});
assert.equal(history.reuseToday,false);
assert.equal(buildStatisticsQueries(options.defaults,options,day).reuseToday,true);
assert.equal(buildStatisticsQueries({...options.defaults,resource_types:['image']},options,day).reuseToday,false);
assert.equal(buildStatisticsQueries({...options.defaults,period:'custom'},options,day).error,'validation');
assert.throws(()=>normalizeStatisticsOptions({...options,members:[{value:1,label:'Owner'}, {value:'bad',label:'Invalid'}]}));
console.log('Statistics integration passed: business errors over HTTP 200, seven resources, permissions, Shanghai midnight, historical labels, date limits and single-request loading.');
