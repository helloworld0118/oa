package com.soft.work.action;

import java.io.Serializable;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import javax.annotation.Resource;
import org.activiti.engine.task.Task;
import org.hibernate.criterion.DetachedCriteria;
import org.hibernate.criterion.MatchMode;
import org.hibernate.criterion.Order;
import org.hibernate.criterion.Restrictions;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;
import com.opensymphony.xwork2.ActionContext;
import com.soft.core.action.ActivitiBaseAction;
import com.soft.core.dao.GenericDao;
import com.soft.core.domain.ActivitiBaseEntity;
import com.soft.core.utils.BeanUtil;
import com.soft.core.utils.JsonOperate;
import com.soft.core.utils.ProcessEnum;
import com.soft.core.utils.ProcessVariableEnum;
import com.soft.core.utils.SystemConstant;
import com.soft.work.dao.FlowCommentsDao;
import com.soft.work.dao.LeaveDao;
import com.soft.work.domain.FlowComments;
import com.soft.work.domain.LeaveFlow;
import com.soft.work.utils.LeaveModel;
import com.wb.core.domain.UserInfo;

@Controller
@Scope("prototype")
public class LeaveAction extends ActivitiBaseAction {
	private static final long serialVersionUID = -1981252606300307764L;
	private LeaveDao dao;
	private LeaveModel leaveModel;
	private FlowCommentsDao commentsDao;

	@Resource
	public void setCommentsDao(FlowCommentsDao commentsDao) {
		this.commentsDao = commentsDao;
	}

	public LeaveModel getLeaveModel() {
		return leaveModel;
	}

	public void setLeaveModel(LeaveModel leaveModel) {
		this.leaveModel = leaveModel;
	}

	@Resource
	public void setDao(LeaveDao dao) {
		this.dao = dao;
	}

	@Override
	public GenericDao getDao() {
		return dao;
	}

	public void start(int id) {
		definitionKey = ProcessEnum.leave.toString();
		super.start(id);
	}

	public void getAll() throws Exception {
		DetachedCriteria queryCriteria = null;
		queryCriteria = DetachedCriteria.forClass(LeaveFlow.class);
		queryCriteria.add(Restrictions.eq("user", getCurrentUser()));
		queryCriteria.addOrder(Order.desc("id"));
		DetachedCriteria criteriaCount = DetachedCriteria
				.forClass(LeaveFlow.class);
		criteriaCount.add(Restrictions.eq("user", getCurrentUser()));
		if (null != getQuery() && !"".equals(getQuery())) {
			queryCriteria.add(Restrictions.like("title", getQuery(),
					MatchMode.ANYWHERE));
			criteriaCount.add(Restrictions.like("title", getQuery(),
					MatchMode.ANYWHERE));
		}
		List<LeaveFlow> lists = dao.find(queryCriteria, getStart(), getLimit());
		Long count = dao.getCount(criteriaCount, new LeaveModel());
		getResponse().getWriter().write(
				JsonOperate.getpageJson(count, getListGson(lists)));
	}

	public void getCurrentModelInfo() throws Exception {
		Task task = taskService.createTaskQuery().taskId(taskId).singleResult();
		LeaveFlow leaveFlow = (LeaveFlow) taskService
				.getVariable(taskId, ProcessVariableEnum.model.toString());
		StringBuffer sb = new StringBuffer();
		sb.append("{");
		sb.append("'id':'" + leaveFlow.getId() + "',");
		sb.append("'userName':'" + leaveFlow.getUser().getUserName()
						+ "',");
		sb.append("'isAllDay':" + leaveFlow.isAllDay() + ",");
		sb.append("'applyDate':'" + leaveFlow.getApplyDate() + "',");
		sb.append("'beginTime':'" + leaveFlow.getBeginTime() + "',");
		sb.append("'endTime':'" + leaveFlow.getEndTime() + "',");
		sb.append("'title':'" + leaveFlow.getTitle() + "',");
		sb.append("'state':'" + leaveFlow.getState() + "',");
		sb.append("'comments':" + JsonFlowComments(leaveFlow) + ",");
		sb.append("'reason':'" + leaveFlow.getReason() + "'");
		sb.append("}");
		getResponse().getWriter().write(sb.toString());
	}

	public String getListGson(List<LeaveFlow> list) {
		StringBuffer sb = new StringBuffer();
		sb.append("[");
		for (LeaveFlow leaveFlow : list) {
			sb.append("{");
			sb.append("'id':'" + leaveFlow.getId() + "',");
			sb.append("'userName':'" + leaveFlow.getUser().getUserName()
							+ "',");
			sb.append("'isAllDay':'" + leaveFlow.isAllDay() + "',");
			sb.append("'applyDate':'" + leaveFlow.getApplyDate() + "',");
			sb.append("'beginTime':'" + leaveFlow.getBeginTime() + "',");
			sb.append("'endTime':'" + leaveFlow.getEndTime() + "',");
			sb.append("'title':'" + leaveFlow.getTitle() + "',");
			sb.append("'state':'" + leaveFlow.getState() + "',");
			sb.append("'comments':" + JsonFlowComments(leaveFlow) + ",");
			sb.append("'reason':'" + leaveFlow.getReason() + "'");
			sb.append("},");
		}
		if (list.size() > 0) {
			sb.deleteCharAt(sb.length() - 1);
		}
		sb.append("]");
		return sb.toString();
	}

	private String JsonFlowComments(ActivitiBaseEntity model) {
		DetachedCriteria criteria = DetachedCriteria
				.forClass(FlowComments.class);
		criteria.add(Restrictions.eq("flowId", model.getId()));
		criteria.add(Restrictions.eq("flowType", 1));
		List<FlowComments> lists = commentsDao.find(criteria);
		StringBuffer sb = new StringBuffer();
		sb.append("[");
		for (FlowComments flowComments : lists) {
			sb.append("{");
			sb.append("'name':'" + flowComments.getUserName() + "',");
			sb.append("'comment':'" + flowComments.getMsg() + "'");
			sb.append("},");
		}
		if (lists.size() > 0) {
			sb.deleteCharAt(sb.length() - 1);
		}
		sb.append("]");
		return sb.toString();
	}

	public void add() throws Exception {
		LeaveFlow leaveflow = new LeaveFlow();
		leaveflow.setAllDay(Boolean.parseBoolean(leaveModel.getIsAllDay()));
		leaveflow.setBeginTime(leaveModel.getBeginTime());
		leaveflow.setEndTime(leaveModel.getEndTime());
		leaveflow.setReason(leaveModel.getReason());
		leaveflow.setTitle(leaveModel.getTitle());
		SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		leaveflow.setApplyDate(format.format(new Date()));
		UserInfo user = (UserInfo) ActionContext.getContext().getSession().get(
				SystemConstant.CURRENT_USER);
		leaveflow.setUser(user);
		leaveflow.setState(1);
		try {
			Serializable id = dao.add(leaveflow);
			start(Integer.parseInt(id.toString()));
			getResponse().getWriter().write("true");
		} catch (Exception e) {
			dao.delete(leaveflow);
			getResponse().getWriter().write("false");
		}
	}
	public void updateModel2Perform() throws Exception{
		LeaveFlow leaveflow = new LeaveFlow();
		leaveflow.setAllDay(Boolean.parseBoolean(leaveModel.getIsAllDay()));
		leaveflow.setBeginTime(leaveModel.getBeginTime());
		leaveflow.setEndTime(leaveModel.getEndTime());
		leaveflow.setReason(leaveModel.getReason());
		leaveflow.setTitle(leaveModel.getTitle());
		Task task = taskService.createTaskQuery().taskId(taskId).singleResult();
		ActivitiBaseEntity entity = (ActivitiBaseEntity) taskService
				.getVariable(taskId, ProcessVariableEnum.model.toString());
		BeanUtil.copy(leaveflow, entity);
		dao.update(entity);
		taskService.setVariable(task.getId(),"days",activitiDao.getDays(leaveflow));
		taskService.setVariable(task.getId(), ProcessVariableEnum.model.toString(), entity);
	}
}
