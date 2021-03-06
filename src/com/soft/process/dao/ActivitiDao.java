package com.soft.process.dao;

import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.activiti.engine.HistoryService;
import org.activiti.engine.RuntimeService;
import org.activiti.engine.TaskService;
import org.activiti.engine.history.HistoricTaskInstance;
import org.activiti.engine.runtime.ProcessInstance;
import org.activiti.engine.task.Attachment;
import org.activiti.engine.task.Task;
import org.hibernate.Criteria;
import org.hibernate.SessionFactory;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.soft.core.domain.ActivitiBaseEntity;
import com.soft.core.utils.BeanUtil;
import com.soft.core.utils.PositionEnum;
import com.soft.core.utils.ProcessVariableEnum;
import com.soft.core.utils.StatusEnum;
import com.soft.core.utils.SystemConstant;
import com.soft.work.dao.FlowCommentsDao;
import com.soft.work.domain.ExpenseFlow;
import com.soft.work.domain.FlowComments;
import com.soft.work.domain.LeaveFlow;
import com.wb.core.domain.UserInfo;

@Repository
@SuppressWarnings("unchecked")
public class ActivitiDao {

	private SessionFactory sessionFactory;
	private RuntimeService runtimeService;
	private HistoryService historyService;
	private TaskService taskService;
	private FlowCommentsDao commentsDao;

	@Resource
	public void setRuntimeService(RuntimeService runtimeService) {
		this.runtimeService = runtimeService;
	}

	@Resource
	public void setSessionFactory(SessionFactory sessionFactory) {
		this.sessionFactory = sessionFactory;
	}

	@Resource
	public void setCommentsDao(FlowCommentsDao commentsDao) {
		this.commentsDao = commentsDao;
	}

	/**
	 * 启动流程
	 * 
	 * @param entity
	 * @param definitionKey
	 */
	public void doStart(ActivitiBaseEntity entity, String definitionKey) {

		entity.setState(StatusEnum.start.getValue());
		sessionFactory.getCurrentSession().saveOrUpdate(entity);
		Map<String, Object> variables = new HashMap<String, Object>();
		variables.put(ProcessVariableEnum.model.toString(), entity);
		try {
			LeaveFlow leave = (LeaveFlow) entity;
			variables.put("days", getDays(leave));
		} catch (Exception e) {
		}
		ProcessInstance processInstance = runtimeService
				.startProcessInstanceByKey(definitionKey, entity.getId()
						.toString(),variables);
		Task task = taskService.createTaskQuery().processInstanceId(
				processInstance.getId()).singleResult();
		taskService.complete(task.getId());
	}

	public long getDays(LeaveFlow leaveFlow) throws Exception {
		if (leaveFlow.isAllDay()) {
			DateFormat format = new SimpleDateFormat("yyyy-MM-dd");
			Date data = format.parse(leaveFlow.getBeginTime());
			Date data2 = format.parse(leaveFlow.getEndTime());
			long days=(data2.getTime()-data.getTime())/24/60/60/1000;
			return days;
		}else{
		    DateFormat format = new SimpleDateFormat("yyyy-MM-dd hh:mm:ss");
			Date data = format.parse(leaveFlow.getBeginTime());
			Date data2 = format.parse(leaveFlow.getEndTime());
			long days=(data2.getTime()-data.getTime())/24/60/60/1000;
			return days;
		}
	}

	/**
	 * 查询当前用户的部门主管
	 * 
	 * @param userId
	 * @return
	 */
	public List<UserInfo> findDeptManager2User(int userId) {
		UserInfo user = (UserInfo) sessionFactory.getCurrentSession().get(
				UserInfo.class, userId);
		Criteria criteria = sessionFactory.getCurrentSession().createCriteria(
				UserInfo.class);
		criteria.createAlias("depart", "d");
		criteria.createAlias("position", "p");
		criteria.add(Restrictions.eq("p.positionName",
				PositionEnum.departManager.getValue()));
		criteria.add(Restrictions.eq("d.id", user.getDepart().getId()));
		return criteria.list();
	}

	/**
	 * 执行任务
	 * 
	 * @param transition
	 *            ：seqenceFlow的名字,用于驳回
	 * @param task
	 *            ：任务
	 * @param model
	 *            : 业务数据
	 * @param currentUser
	 *            ：申请人
	 * @param comment
	 *            ：审批意见
	 */
	public void doTask(String transition, Task task, Object model,
			UserInfo currentUser, String comment) {
		Map<String, Object> variables = new HashMap<String, Object>();
		variables.put(ProcessVariableEnum.transition.toString(), transition);
		if (SystemConstant.REQUEST_TASK.equals(task.getName())) {
			ActivitiBaseEntity m = (ActivitiBaseEntity) model;
			ActivitiBaseEntity entity = (ActivitiBaseEntity) sessionFactory
					.getCurrentSession().get(model.getClass(), m.getId());
			BeanUtil.copy(model, entity);
			sessionFactory.getCurrentSession().save(entity);
			try {
				LeaveFlow leave = (LeaveFlow) entity;
				variables.put("days", getDays(leave));
			} catch (Exception e) {
			}
			variables.put(ProcessVariableEnum.model.toString(), entity);
		}
		taskService.claim(task.getId(), currentUser.getUserName());
		taskService.complete(task.getId(), variables);
		if (null != comment && !"".equals(comment.trim())) {
			FlowComments flowComm = new FlowComments();
			ActivitiBaseEntity m = (ActivitiBaseEntity) model;
			flowComm.setFlowId(m.getId());
			flowComm.setMsg(comment);
			flowComm.setUserName(currentUser.getUserName());
			try {
				LeaveFlow leave = (LeaveFlow) model;
				flowComm.setFlowType(1);
			} catch (Exception e) {
				flowComm.setFlowType(2);
			}
			commentsDao.add(flowComm);
		}
	}

	/**
	 * 查询流程实例的审批意见
	 * 
	 * @param processInstance
	 * @return
	 */
/*	public List<Map<String, String>> getComments(String processInstanceId) {
		List<Attachment> attachments = taskService
				.getProcessInstanceAttachments(processInstanceId);
		List<Map<String, String>> list = new ArrayList<Map<String, String>>();
		for (Attachment comment : attachments) {
			Map<String, String> map = new HashMap<String, String>();
			HistoricTaskInstance t = historyService
					.createHistoricTaskInstanceQuery().taskId(
							comment.getTaskId()).singleResult();
			String commentName = t.getName() + "(" + comment.getName() + ")";
			map.put("taskName", commentName);
			map.put("comment", comment.getDescription());
			list.add(map);
		}
		return list;
	}*/

	@Resource
	public void setTaskService(TaskService taskService) {
		this.taskService = taskService;

	}

	@Resource
	public void setHistoryService(HistoryService historyService) {
		this.historyService = historyService;
	}
}
