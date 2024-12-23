import { useState } from 'react';

// 曜日をintで表す
const weekDayobj = {
    'Sunday'    : 0,
    'Monday'    : 1,
    'Tuesday'   : 2,
    'Wednesday' : 3,
    'Thursday'  : 4,
    'Friday'    : 5,
    'Saturday'  : 6,
}

// 月の稼働開始日入力欄
export const WorkDaycalendar = ({value, calendarId, onChangeWorkDay} : any) => {

    const label = calendarId === 'calendar_start' ? '開始日' : '終了日';

    return (
        <>
            <label>{label}</label>
            <input type="date" name="calendar" value={value} id={calendarId} onChange={onChangeWorkDay} />
        </>
    );
}

// 月の稼働可能日入力欄
export const WorkDay = ({states, workDayIds, workDayResult} :object) => {

    return (
        <div>
            <h2>月の稼働可能日</h2>
            <WorkDaycalendar value={states.workDayStart} calendarId={workDayIds.startId} onChangeWorkDay={workDayResult} />
            <WorkDaycalendar value={states.workDayEnd} calendarId={workDayIds.endId} onChangeWorkDay={workDayResult} />
        </div>
    );
}

// 一日当たりの稼働時間入力欄
export const DailyWorkTime = ({state, dailyWorkTimeResult} : object) => {
    return (
        <div>
            <h2>一日当たりの稼働時間</h2>
            <input type="number" name="day_hour" id="day_hour" max="12" value={state} onChange={dailyWorkTimeResult} />
        </div>
    );
}

// 稼働日として除外する条件入力欄
export const RemoveDay = ({states, addRemoveDayElement, removeDayResult} : any) => {

    return (
        <div>
            <h2>稼働日として除外する条件</h2>
            <h3>日付</h3>
            <button type="button" className="add_button" value="add" onClick={addRemoveDayElement}>追加</button>
            <div>
                {states.removeDayElement.map((dataset, index) => (
                    <div key={index} data-btn={dataset}>
                        <input type="date" name="remove_calendar" className="remove_calendar"  onChange={removeDayResult} />
                        <button type="button" id={dataset} >削除</button>
                    </div>
                ))}
            </div>
            <div id="remove_date_block">
            </div>
            <h3>曜日</h3>
            <label htmlFor="0">日<input type="checkbox" name="remove_week" id="0" className="remove_week" value="Sunday" onChange={removeDayResult} /></label>
            <label htmlFor="1">月<input type="checkbox" name="remove_week" id="1" className="remove_week" value="Monday" onChange={removeDayResult} /></label>
            <label htmlFor="2">火<input type="checkbox" name="remove_week" id="2" className="remove_week" value="Tuesday" onChange={removeDayResult} /></label>
            <label htmlFor="3">水<input type="checkbox" name="remove_week" id="3" className="remove_week" value="Wednesday" onChange={removeDayResult} /></label>
            <label htmlFor="4">木<input type="checkbox" name="remove_week" id="4" className="remove_week" value="Thursday" onChange={removeDayResult} /></label>
            <label htmlFor="5">金<input type="checkbox" name="remove_week" id="5" className="remove_week" value="Friday" onChange={removeDayResult} /></label>
            <label htmlFor="6">土<input type="checkbox" name="remove_week" id="6" className="remove_week" value="Saturday" onChange={removeDayResult} /></label>
        </div>
    );
}

// 既に決まっている稼働時間入力欄
export const DecidedWorkTime = ({state, decidedWorkTimeResult} : object) => {
    return (
        <div>
            <h2>既に決まっている稼働時間</h2>
            <input type="number" name="decided_hour" id="decided_hour" value={state} onChange={decidedWorkTimeResult} />
        </div>
    );
}

// 入力フォーム
export const Form = ({formProps} : object) => {

    const workDayData         = formProps.workDay;
    const dailyWorkTimeData   = formProps.dailyWorkTime;
    const removeDayData       = formProps.removeDay;
    const decidedWorkTimeData = formProps.decidedWorkTime;

    return (
        <div>
            <WorkDay states={workDayData.states} workDayIds={workDayData.workDayIds} workDayResult={workDayData.workDayResult} />
            <DailyWorkTime state={dailyWorkTimeData.state} dailyWorkTimeResult={dailyWorkTimeData.dailyWorkTimeResult} />
            <RemoveDay states={removeDayData.states} addRemoveDayElement={removeDayData.addRemoveDayElement} removeDayResult={removeDayData.removeDayResult} />
            <DecidedWorkTime state={decidedWorkTimeData.state} decidedWorkTimeResult={decidedWorkTimeData.decidedWorkTimeResult} />
        </div>
    );
}

// 結果出力
export const Result = ({workTimeResult} : object) => {

    const workDayStart    = workTimeResult.workDayStart;
    const workDayEnd      = workTimeResult.workDayEnd;
    const workDay         = workTimeResult.workDay;
    const dailyWorkTime   = workTimeResult.dailyWorkTime;
    const removeDayData   = workTimeResult.removeDayData;
    const decidedWorkTime = workTimeResult.decidedWorkTime;

    // 月の稼働日を抽出
    const targetDateRange = [];
    for (let d = new Date(workDayStart); d <= new Date(workDayEnd); d.setDate(d.getDate() + 1)) {
        const formatedDate = d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2);

        targetDateRange.push(formatedDate);
    }

    // 除外する曜日をintに変更
    const intRemoveDayWeekData = removeDayData.week.map((week : string) => weekDayobj[week]);

    // 除外する曜日の合計日数
    const removeDayWeekCount = targetDateRange.map(targetDate => new Date(targetDate).getDay())
    .filter(targetDay => intRemoveDayWeekData.includes(targetDay));

    // 稼働日として除外する日数の計算
    const removeDay = removeDayData.day.length + removeDayWeekCount.length;

    // 稼働可能時間の計算
    const result = (workDay * dailyWorkTime) - (removeDay * dailyWorkTime) - decidedWorkTime;

    return (
        <div>
            <h2>稼働可能時間</h2>
            <p>{result}時間</p>
        </div>
    );
}

// 全体
export default function portfolio() {

    // 本日の日付
    const day   = new Date();
    const year  = day.getFullYear();
    const month = ('0' + (day.getMonth() + 1)).slice(-2);
    const date  = ('0' + day.getDate()).slice(-2);
    const today = `${year}-${month}-${date}`;

    // 稼働開始日の状態管理
    const [workDayStart, setWorkDayStart] = useState(today);

    // 稼働終了日の状態管理
    const [workDayEnd, setWorkDayEnd] = useState(today);

    // 月の稼働日の状態管理
    const [workDay, setWorkDay] = useState(0);

    // 一日当たりの稼働時間の状態管理
    const [dailyWorkTime, setDailyWorkTime] = useState(0);

    // 稼働日として除外する条件の状態管理
    const [removeDay, setRemoveDay] = useState({week:[], day:[]});
    const [removeDayElement, setRemoveDayElement] = useState([]);

    // 既に決まっている稼働時間の状態管理
    const [decidedWorkTime, setDecidedWorkTime] = useState(0);

    // propsの作成
    const formProps = {
        workDay : {
            // 開始日、終了日のID
            workDayIds : {
                startId : 'calendar_start',
                endId   : 'calendar_end'
            },

            // 開始日、終了日の状態
            states : {
                workDayStart : workDayStart,
                workDayEnd   : workDayEnd,
            },

            // 稼働可能日の計算と状態管理メソッド
            workDayResult : (e : any) => {

                // 状態の更新
                if (e.target.id === formProps.workDay.workDayIds.startId) setWorkDayStart(e.target.value);
                if (e.target.id === formProps.workDay.workDayIds.endId  ) setWorkDayEnd(e.target.value);
        
                // 稼働可能日数を算出
                const result = e.target.id === formProps.workDay.workDayIds.startId ? new Date(formProps.workDay.states.workDayEnd) - new Date(e.target.value) : new Date(e.target.value) - new Date(formProps.workDay.states.workDayStart) ;
        
                // workDay状態管理
                setWorkDay(Math.round(result / (24*60*60*1000)) + 1);
            }
        },

        dailyWorkTime : {
            // 一日当たりの稼働時間の状態
            state : dailyWorkTime,

            // 一日当たりの稼働時間の状態管理メソッド
            dailyWorkTimeResult : (e : any) => setDailyWorkTime(e.target.value),
        },

        removeDay : {

            // 稼働日として除外する日
            states : {
                removeDay        : removeDay,
                removeDayElement : removeDayElement,
            },

            // 除外する日の要素を追加するメソッド
            addRemoveDayElement : () => setRemoveDayElement([...removeDayElement, `removeDayId_${removeDayElement.length}`]),

            // 除外する日の計算と状態管理メソッド
            removeDayResult : (e : any) => {

                // 日付の管理
                if (e.target.className === 'remove_calendar' && ! removeDay.day.includes(e.target.value)) {
                    setRemoveDay({...removeDay, day : [...removeDay.day, e.target.value]});
                }

                // 曜日の管理
                if (e.target.className === 'remove_week') {
                    if (e.target.checked) setRemoveDay({...removeDay, week : [...removeDay.week, e.target.value]});
                    if (! e.target.checked) setRemoveDay({...removeDay, week : removeDay.week.filter(value => e.target.value !== value)});
                }
            }
        },

        decidedWorkTime : {
            // 既に決まっている稼働時間の状態
            state : decidedWorkTime,

            //既に決まっている稼働時間の状態管理メソッド
            decidedWorkTimeResult : (e : any) => setDecidedWorkTime(e.target.value),
        },
    }

    const workTimeResult = {
        workDayStart    : workDayStart,
        workDayEnd      : workDayEnd,
        workDay         : workDay,
        dailyWorkTime   : dailyWorkTime,
        removeDayData   : removeDay,
        decidedWorkTime : decidedWorkTime,
    }

    return (
        <>
            <h1>個人リソース可視化ツール</h1>
            <Form formProps={formProps} />
            <Result workTimeResult={workTimeResult} />
        </>
    );
}
