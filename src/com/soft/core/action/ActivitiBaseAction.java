package com.soft.core.action;

import java.lang.reflect.Method;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.activiti.engine.HistoryService;
import org.activiti.engine.RuntimeService;
import org.activiti.engine.TaskService;
import org.activiti.engine.history.HistoricProcessInstance;
import org.activiti.engine.history.HistoricTaskInstance;
import org.activiti.engine.runtime.ProcessInstance;
import org.activiti.engine.task.Attachment;
import org.activiti.engine.task.Task;
import org.hibernate.criterion.Criterion;
import org.hibernate.criterion.DetachedCriteria;
import org.hibernate.criterion.Restrictions;
import org.springframework.transaction.annotation.Transactional;

import com.opensymphony.xwork2.ActionContext;
import com.soft.core.dao.GenericDao;
import com.soft.core.domain.ActivitiBaseEntity;
import com.soft.core.utils.BeanUtil;
import com.soft.core.utils.ProcessEnum;
import com.soft.core.utils.ProcessVariableEnum;
import com.soft.core.utils.StatusEnum;
import com.soft.core.utils.SystemConstant;
import com.soft.process.dao.ActivitiDao;

public abstract class ActivitiBaseAction<T> extends BaseAction<T> {

	private static final long serialVersionUID = -4393074864539616294L;

	protected TaskService taskService;
	protected ActivitiDao activitiDao;
	private HistoryService historyService;
	protected String taskId;
	private String transition;
	protected String definitionKey;
	/**
	 * 审批意见
	 */
	private String comment;

	@Resource
	public void setTaskService(TaskService taskService) {
		this.taskService = taskService;
	}

	@Resource
	public void setActivitiDao(ActivitiDao activitiDao) {
		this.activitiDao = activitiDao;
	}

	/**
	 * 启动流程
	 * 
	 * @return
	 */
	public void start(int id) {
		ActivitiBaseEntity entity = (ActivitiBaseEntity) getDao().get(id);
		activitiDao.doStart(entity, definitionKey);
	}

	/**
	 * 执行任务
	 * 
	 * @return
	 */
	public void performTask() {
		Task task = taskService.createTaskQuery().taskId(taskId).singleResult();
		ActivitiBaseEntity entity = (ActivitiBaseEntity) taskService
				.getVariable(taskId, ProcessVariableEnum.model.toString());
		activitiDao.doTask(transition, task, entity, getCurrentUser(), comment);
	}

	/**
	 * 审批结束的查看
	 * 
	 * @return
	 */
	/*
	 * public String watch() throws Exception { Method idGetter =
	 * BeanUtil.getMethod(modelClass, ID_GET_METHOD); // 掉用getId方法得到id Long id =
	 * (Long) idGetter.invoke(model); beforToUpdate(); T entity = (T)
	 * getDao().get(id); afterToUpdate(entity);
	 * ActionContext.getContext().getValueStack().push(entity);
	 * 
	 * HistoricProcessInstance processInstance =
	 * historyService.createHistoricProcessInstanceQuery()
	 * .processDefinitionKey(definitionKey)
	 * .processInstanceBusinessKey(id.toString()).singleResult();
	 * 
	 * List<Map<String, String>> list =
	 * activitiDao.getComments(processInstance.getId());
	 * 
	 * ActionContext.getContext().put("commentList", list);
	 * 
	 * return "watch"; }
	 */

	public void setTaskId(String taskId) {
		this.taskId = taskId;
	}

	public void setTransition(String transition) {
		this.transition = transition;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}

	public void setDefinitionKey(String definitionKey) {
		this.definitionKey = definitionKey;
	}

	@Resource
	public void setHistoryService(HistoryService historyService) {
		this.historyService = historyService;
	}

}
