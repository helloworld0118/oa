package com.wb.task.action;

import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

import javax.annotation.Resource;

import org.hibernate.criterion.DetachedCriteria;
import org.hibernate.criterion.Order;
import org.hibernate.criterion.Restrictions;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;

import com.soft.core.action.AbstractAction;
import com.soft.core.utils.JsonOperate;
import com.wb.task.dao.TaskEventDao;
import com.wb.task.domain.TaskEvent;
import com.wb.task.domain.TaskInfo;

@Controller
@Scope("prototype")
public class TaskEventAction  extends AbstractAction{

	private static final long serialVersionUID = 1L;
	private TaskEventDao dao;
	private int taskID;
	private TaskEvent taskEvent;
	
	public int getTaskID() {
		return taskID;
	}
	public void setTaskID(int taskID) {
		this.taskID = taskID;
	}
	public TaskEventDao getDao() {
		return dao;
	}
	public TaskEvent getTaskEvent() {
		return taskEvent;
	}
	public void setTaskEvent(TaskEvent taskEvent) {
		this.taskEvent = taskEvent;
	}
	@Resource
	public void setDao(TaskEventDao dao) {
		this.dao = dao;
	}
    public void addEvent(){
    	TaskInfo taskInfo=new TaskInfo();
    	taskInfo.setId(taskID);
    	taskEvent.setOperateUser(getCurrentUser().getUserName());
    	SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
    	taskEvent.setTime(format.format(new Date()));
    	taskEvent.setTaskInfo(taskInfo);
    	dao.add(taskEvent);
    }
	public void getAllByTask() throws Exception{
		String queryStr=request.getParameter("filter");
		queryStr=queryStr.substring(0,queryStr.lastIndexOf("\""));
		queryStr=queryStr.substring(queryStr.lastIndexOf("\"")+1);
		taskID=Integer.parseInt(queryStr);	
		DetachedCriteria criteria=DetachedCriteria.forClass(TaskEvent.class);
		criteria.createAlias("taskInfo", "t");
		criteria.add(Restrictions.eq("t.id", taskID));
		DetachedCriteria criteriaCount=DetachedCriteria.forClass(TaskEvent.class);
		criteriaCount.createAlias("taskInfo", "t");
		criteriaCount.add(Restrictions.eq("t.id", taskID));
		criteria.addOrder(Order.desc("id"));
		List<TaskEvent> list=dao.find(criteria,getStart(),getLimit());
		Long count = dao.getCount(criteriaCount, new TaskEvent());
		try {
			getResponse().getWriter().write(
					JsonOperate.getpageJson(count, formatToJson(list)));
		} catch (IOException e) {
		}
	}
	private String formatToJson(List<TaskEvent> list) {
		StringBuffer sb = new StringBuffer();
		sb.append("[");
		for (TaskEvent taskEvent : list) {
			sb.append("{");
			sb.append("'id':" + taskEvent.getId() + ",");
			sb.append("'taskInfo':" + taskEvent.getTaskInfo().getId()
					+ ",");
			sb.append("'content':'" + taskEvent.getContent()
					+ "',");
			sb.append("'operateUser':'" + taskEvent.getOperateUser()
					+ "',");
			sb.append("'time':'" + taskEvent.getTime()
					+ "',");
			sb.append("'type':" + taskEvent.getType()
					+ "");
			sb.append("},");
		}
		if (list.size() > 0) {
			sb.deleteCharAt(sb.length() - 1);
		}
		sb.append("]");
		return sb.toString();
	}


}
