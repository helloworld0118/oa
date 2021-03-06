package com.soft.process.action;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.activiti.engine.HistoryService;
import org.activiti.engine.RuntimeService;
import org.activiti.engine.TaskService;
import org.activiti.engine.history.HistoricTaskInstance;
import org.activiti.engine.impl.RepositoryServiceImpl;
import org.activiti.engine.impl.persistence.entity.ExecutionEntity;
import org.activiti.engine.impl.persistence.entity.ProcessDefinitionEntity;
import org.activiti.engine.impl.pvm.PvmTransition;
import org.activiti.engine.impl.pvm.process.ActivityImpl;
import org.activiti.engine.query.Query;
import org.activiti.engine.repository.ProcessDefinition;
import org.activiti.engine.task.Attachment;
import org.activiti.engine.task.Comment;
import org.activiti.engine.task.Task;
import org.activiti.engine.task.TaskQuery;
import org.hibernate.criterion.DetachedCriteria;
import org.hibernate.criterion.Restrictions;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;

import com.google.gson.Gson;
import com.opensymphony.xwork2.ActionContext;
import com.soft.core.domain.ActivitiBaseEntity;
import com.soft.core.utils.JsonOperate;
import com.soft.core.utils.ProcessVariableEnum;
import com.soft.process.dao.ActivitiDao;
import com.soft.work.dao.FlowCommentsDao;
import com.soft.work.domain.ExpenseFlow;
import com.soft.work.domain.FlowComments;
import com.soft.work.domain.LeaveFlow;
import com.wb.core.dao.UserDao;
import com.wb.core.domain.Position;
import com.wb.core.domain.UserInfo;

@Controller
@Scope("prototype")
public class ProcessTaskAction extends ProcessBaseAction {


	private TaskService taskService;
	private RepositoryServiceImpl repositoryService;
	private RuntimeService runtimeService;
	private ActivitiDao activitiDao;
	private UserDao userDao;
	private FlowCommentsDao commentsDao;

	/**
	 * 查询条件
	 */
	private String taskId;
	private String taskName;

	@Resource
	public void setUserDao(UserDao userDao) {
		this.userDao = userDao;
	}

	@Resource
	public void setTaskService(TaskService taskService) {
		this.taskService = taskService;
	}

	@Resource
	public void setRuntimeService(RuntimeService runtimeService) {
		this.runtimeService = runtimeService;
	}

	@Resource
	public void setCommentsDao(FlowCommentsDao commentsDao) {
		this.commentsDao = commentsDao;
	}

	public void getAll() throws Exception {
		Query query = createQuery();
		long total = query.count();
		List<Task> list = query.listPage(start, limit);
		getResponse().getWriter().write(
				JsonOperate.getpageJson(total, getListGson(list)));
	}

	public String getListGson(List<Task> list) {
		StringBuffer sb = new StringBuffer();
		sb.append("[");
		try {
			for (Task task : list) {
				ActivitiBaseEntity model = (ActivitiBaseEntity) taskService
						.getVariable(task.getId(), ProcessVariableEnum.model
								.toString());
				sb.append("{");
				sb.append("'id':'" + task.getId() + "',");
				sb.append("'title':'" + model.getTitle() + "',");
				sb.append("'applyUser':'" + model.getUser().getUserName() + "',");
				sb.append("'applyDate':'" + model.getApplyDate() + "',");
				ProcessDefinition processDefinition = repositoryService
						.createProcessDefinitionQuery().processDefinitionId(
								task.getProcessDefinitionId()).singleResult();
				sb.append("'flowName':'" + processDefinition.getName() + "',");
				sb.append("},");
			}
			if (list.size() > 0) {
				sb.deleteCharAt(sb.length() - 1);
			}
		} catch (Exception e) {
		}
		sb.append("]");
		return sb.toString();
	}

	/*
	 * 代办任务的查询条件
	 */
	@Override
	public Query createQuery() {
		TaskQuery query = taskService.createTaskQuery();
		UserInfo currentUser = userDao.get(getCurrentUser().getId());
		query.taskCandidateUser(currentUser.getUserName());
		List<String> positions=new ArrayList<String>();
		positions.add(currentUser.getPosition().getPositionName());
		query.taskCandidateGroupIn(positions);
		return query;
	}
	//得到待办数量
	//TODO  得到待办数量
	public void getWaitCount() throws Exception {
		TaskQuery query = taskService.createTaskQuery();
		UserInfo currentUser = userDao.get(getCurrentUser().getId());
		query.taskCandidateUser(currentUser.getUserName());
		List<String> positions=new ArrayList<String>();
		positions.add(currentUser.getPosition().getPositionName());
		query.taskCandidateGroupIn(positions);
		getResponse().getWriter().write(query.count()+"");
	}
	/*
	 * public List<Map<String, Object>> doResult(List<?> list) {
	 * List<Map<String, Object>> result = new ArrayList<Map<String, Object>>();
	 * for (Object obj : list) { Task task = (Task) obj; Map<String, Object> map
	 * = new HashMap<String, Object>(); Object model =
	 * taskService.getVariable(task.getId(),
	 * ProcessVariableEnum.model.toString()); map.put("model", model);
	 * map.put("task", task); ProcessDefinition processDefinition =
	 * repositoryService .createProcessDefinitionQuery().processDefinitionId(
	 * task.getProcessDefinitionId()).singleResult(); map.put("processName",
	 * processDefinition.getName()); result.add(map); } return result; }
	 */

	protected void doDelete(String id) {
		taskService.deleteTask(id, true);
	}
    
	/**
	 * 跳到任务执行页
	 * 
	 * @return
	 */
	public void toTask() throws Exception {
		Task task = taskService.createTaskQuery().taskId(taskId).singleResult();
		ActivitiBaseEntity model = (ActivitiBaseEntity) taskService
				.getVariable(taskId, ProcessVariableEnum.model.toString());
		StringBuffer sb = new StringBuffer();
		sb.append("{data:{");
		sb.append("'id':'" + task.getId() + "',");
		sb.append("'applyName':'" + model.getUser().getUserName() + "',");
		sb.append("'title':'" + model.getTitle() + "',");
		sb.append("'applyReason':'" + model.getReason() + "',");
		sb.append("'comments':"+JsonFlowComments(model)+",");
		sb.append("'applyContent':'" + formatApplyContext(model, task) + "'");
		sb.append("}}");
		getResponse().getWriter().write(sb.toString());
		// 查询审批意见
	}
   private String JsonFlowComments(ActivitiBaseEntity model){
	   DetachedCriteria criteria=DetachedCriteria.forClass(FlowComments.class);
	   criteria.add(Restrictions.eq("flowId", model.getId()));
	   String type=request.getParameter("commType");
	   criteria.add(Restrictions.eq("flowType", Integer.parseInt(type)));
	   List<FlowComments> lists=commentsDao.find(criteria);
	   StringBuffer sb = new StringBuffer();
		sb.append("[");
		for (FlowComments flowComments : lists) {
			sb.append("{");
			sb.append("'name':'" + flowComments.getUserName() + "',");
			sb.append("'comment':'" + flowComments.getMsg()+ "'");
			sb.append("},");
		}
		if (lists.size() > 0) {
			sb.deleteCharAt(sb.length() - 1);
		}
		sb.append("]");
		return sb.toString();
   }
	private String formatApplyContext(ActivitiBaseEntity model, Task task) {
		ProcessDefinition processDefinition = repositoryService
				.createProcessDefinitionQuery().processDefinitionId(
						task.getProcessDefinitionId()).singleResult();
		StringBuffer sb = new StringBuffer();
		if (processDefinition.getName().equals("请假流程")) {
			LeaveFlow leave = (LeaveFlow) model;
			sb.append(leave.getBeginTime()
					+ "至"
					+ leave.getEndTime());
		} else {
			ExpenseFlow expenseFlow = (ExpenseFlow) model;
			sb.append("报销金额：" + expenseFlow.getExpenseMoney());
		}
		return sb.toString();
	}


	public void getButtonsForTransition() {
		Task task = taskService.createTaskQuery().taskId(taskId).singleResult();
		ProcessDefinitionEntity pde = (ProcessDefinitionEntity) repositoryService
				.getDeployedProcessDefinition(task.getProcessDefinitionId());
		ExecutionEntity exe = (ExecutionEntity) runtimeService
				.createExecutionQuery().executionId(task.getExecutionId())
				.singleResult();
		ActivityImpl activity = pde.findActivity(exe.getActivityId());
		List<PvmTransition> transitions = activity.getOutgoingTransitions();
		List<String> buttons = new ArrayList<String>();
		for (PvmTransition pvmTransition : transitions) {
			buttons.add(pvmTransition.getProperty("name").toString());
		}
		Gson gson = new Gson();
		String btns = gson.toJson(buttons);
		try {
			getResponse().getWriter().write(btns);
		} catch (IOException e) {
			e.printStackTrace();
		}
	}

	public String getTaskId() {
		return taskId;
	}

	public void setTaskId(String taskId) {
		this.taskId = taskId;
	}

	public String getTaskName() {
		return taskName;
	}

	public void setTaskName(String taskName) {
		this.taskName = taskName;
	}

	@Resource
	public void setActivitiDao(ActivitiDao activitiDao) {
		this.activitiDao = activitiDao;
	}

	@Resource
	public void setRepositoryService(RepositoryServiceImpl repositoryService) {
		this.repositoryService = repositoryService;
	}

}
