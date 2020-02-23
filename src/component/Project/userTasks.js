import React, { Component } from 'react';
import { Descriptions, Tabs, Divider } from "antd";
import storage from "../storage";
import './userTask.css';
import FinishTaskModal from "../Profile/FinishTaskModal";
import MasterModal from "../Master/MasterModal"
const { TabPane } = Tabs;

class UserTasks extends Component{
    constructor(props) {
        super(props);
        this.state = {
            workingTacks: []
        }
    }
    componentWillMount() {
        let token = storage.get('token');
        if (token) {
            this.getTasksInfo(token)
        }
    }

    getTasksInfo = (token) => {
        fetch('https://api.bangneedu.com/projectTaskUser/1', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": "Bearer " + token
            }})
            .then((res) => res.json())
            .then( res => {
                console.log(res);
                let newData = this.getTimeDiff(res.data, new Date());
                this.setState({
                    workingTacks: newData
                });
            })
            .catch( err => console.log(err))
        fetch('https://api.bangneedu.com/projectTaskUser/2', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": "Bearer " + token
            }})
            .then((res) => res.json())
            .then( res => {
                console.log(res);
                let newData = this.getTimeDiff(res.data);
                this.setState({
                    workedTacks: newData
                });
            })
            .catch( err => console.log(err))
    }

    getTimeDiff = (data, dateEnd) => {
        for(let i = 0; i < data.length; i++) {
            let dateBegin = new Date(data[i].createTime.replace(/-/g, "/"));
            if(dateEnd === undefined) {
                dateEnd = new Date(data[i].completionTime.replace(/-/g, "/"));
            }
            let dateDiff = dateEnd.getTime() - dateBegin.getTime();//时间差的毫秒数
            let dayDiff = Math.floor(dateDiff / (24 * 3600 * 1000));//计算出相差天数
            let leave1 = dateDiff % (24 * 3600 * 1000);   //计算天数后剩余的毫秒数
            let hours = Math.floor(leave1 / (3600 * 1000)); //计算出小时数
            //计算相差分钟数
            let leave2 = leave1 % (3600 * 1000);    //计算小时数后剩余的毫秒数
            let minutes = Math.floor(leave2 / (60 * 1000));  //计算相差分钟数
            //计算相差秒数
            let leave3 = leave2 % (60 * 1000);      //计算分钟数后剩余的毫秒数
            let seconds = Math.round(leave3 / 1000);
            data[i].timeDiff = {
                dayDiff: dayDiff,
                hours: hours,
                minutes: minutes,
                seconds: seconds
            }
        }
        return data;
    };

    render() {
        return <Tabs defaultActiveKey="1" className='myTasks'>
            <TabPane tab="未完成任务" key="1">
                <div className='workingTask'>
                    {
                        this.state.workingTacks && this.state.workingTacks.map((item, index) => {
                            return <div key={index}>
                                <Descriptions title={
                                    <div>
                                        任务2：{item.taskName}
                                        <div style={{float: 'right', fontWeight: 400, fontSize: 14}}>你已开始了：
                                            <span className='mainColor'>{item.timeDiff.dayDiff}</span> 天 <span className='mainColor'>{item.timeDiff.hours}</span> 时 <span className='mainColor'>{item.timeDiff.minutes}</span> 分 <span className='mainColor'>{item.timeDiff.seconds}</span> 秒
                                        </div>
                                    </div>
                                } column={1}>
                                    <Descriptions.Item label="项目来自">{item.projectName}</Descriptions.Item>
                                </Descriptions>
                                <FinishTaskModal id={item.id} getTasksInfo={this.getTasksInfo}/>
                                <Divider className='custom-divider'/>
                            </div>
                        })
                    }

                </div>
            </TabPane>
            <TabPane tab="已完成任务" key="2">
                <div className='workingTask'>
                    {
                        this.state.workedTacks && this.state.workedTacks.map((item, index) => {
                            return <div key={index}>
                                <Descriptions title={
                                    <div>
                                        任务2：{item.taskName} <span style={{color: '#05be60', fontSize: 14}}> (已完成)</span>
                                        <div style={{float: 'right', fontWeight: 400, fontSize: 14}}>你一共用了：
                                            <span className='mainColor'>{item.timeDiff.dayDiff}</span> 天 <span className='mainColor'>{item.timeDiff.hours}</span> 时 <span className='mainColor'>{item.timeDiff.minutes}</span> 分 <span className='mainColor'>{item.timeDiff.seconds}</span> 秒
                                        </div>
                                    </div>
                                } column={1}>
                                    <Descriptions.Item label="项目来自">{item.projectName}</Descriptions.Item>
                                    <Descriptions.Item label="任务评价">{item.evaluate ? item.evaluate : '稍后给出作业评价'}</Descriptions.Item>
                                </Descriptions>
                                <MasterModal projectTask={item}/>
                                <Divider className='custom-divider'/>
                            </div>
                        })
                    }
                </div>
            </TabPane>
        </Tabs>
    }
}

export default UserTasks;
