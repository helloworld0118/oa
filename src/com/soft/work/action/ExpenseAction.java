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
import com.soft.work.dao.ExpenseDao;
import com.soft.work.dao.FlowCommentsDao;
import com.soft.work.domain.FlowComments;
import com.soft.work.domain.ExpenseFlow;
import com.soft.work.utils.ExpenseModel;
import com.wb.core.domain.UserInfo;

@Controller
@Scope("prototype")
public class ExpenseAction extends ActivitiBaseAction {
	private static final long serialVersionUID = -1981252606300307764L;
	private ExpenseDao dao;
	private ExpenseModel expenseModel;
	private FlowCommentsDao commentsDao;

	@Resource
	public void setCommentsDao(FlowCommentsDao commentsDao) {
		this.commentsDao = commentsDao;
	}

	public ExpenseModel getExpenseModel() {
		return expenseModel;
	}

	public void setExpenseModel(ExpenseModel expenseModel) {
		this.expenseModel = expenseModel;
	}

	@Resource
	public void setDao(ExpenseDao dao) {
		this.dao = dao;
	}

	@Override
	public GenericDao getDao() {
		return dao;
	}

	public void start(int id) {
		definitionKey = ProcessEnum.expense.toString();
		super.start(id);
	}

	public void getAll() throws Exception {
		DetachedCriteria queryCriteria = null;
		queryCriteria = DetachedCriteria.forClass(ExpenseFlow.class);
		queryCriteria.add(Restrictions.eq("user", getCurrentUser()));
		queryCriteria.addOrder(Order.desc("id"));
		DetachedCriteria criteriaCount = DetachedCriteria
				.forClass(ExpenseFlow.class);
		criteriaCount.add(Restrictions.eq("user", getCurrentUser()));
		if (null != getQuery() && !"".equals(getQuery())) {
			queryCriteria.add(Restrictions.like("title", getQuery(),
					MatchMode.ANYWHERE));
			criteriaCount.add(Restrictions.like("title", getQuery(),
					MatchMode.ANYWHERE));
		}
		List<ExpenseFlow> lists = dao.find(queryCriteria, getStart(), getLimit());
		Long count = dao.getCount(criteriaCount, new ExpenseModel());
		getResponse().getWriter().write(
				JsonOperate.getpageJson(count, getListGson(lists)));
	}

	public void getCurrentModelInfo() throws Exception {
		Task task = taskService.createTaskQuery().taskId(taskId).singleResult();
		ExpenseFlow expenseFlow = (ExpenseFlow) taskService
				.getVariable(taskId, ProcessVariableEnum.model.toString());
		StringBuffer sb = new StringBuffer();
		sb.append(expenseFlow.getExpenseMoney());
		getResponse().getWriter().write(sb.toString());
	}

	public String getListGson(List<ExpenseFlow> list) {
		StringBuffer sb = new StringBuffer();
		sb.append("[");
		for (ExpenseFlow expenseFlow : list) {
			sb.append("{");
			sb.append("'id':'" + expenseFlow.getId() + "',");
			sb.append("'userName':'" + expenseFlow.getUser().getUserName()
							+ "',");
			sb.append("'applyDate':'" + expenseFlow.getApplyDate() + "',");
			sb.append("'expenseMoney':'" + expenseFlow.getExpenseMoney() + "',");
			sb.append("'title':'" + expenseFlow.getTitle() + "',");
			sb.append("'state':'" + expenseFlow.getState() + "',");
			sb.append("'comments':" + JsonFlowComments(expenseFlow) + ",");
			sb.append("'reason':'" + expenseFlow.getReason() + "'");
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
		criteria.add(Restrictions.eq("flowType", 2));
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
		ExpenseFlow expenseFlow = new ExpenseFlow();
		expenseFlow.setReason(expenseModel.getReason());
		expenseFlow.setTitle(expenseModel.getTitle());
		expenseFlow.setExpenseMoney(expenseModel.getExpenseMoney());
		SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		expenseFlow.setApplyDate(format.format(new Date()));
		UserInfo user = (UserInfo) ActionContext.getContext().getSession().get(
				SystemConstant.CURRENT_USER);
		expenseFlow.setUser(user);
		expenseFlow.setState(1);
		try {
			Serializable id = dao.add(expenseFlow);
			start(Integer.parseInt(id.toString()));
			getResponse().getWriter().write("true");
		} catch (Exception e) {
			dao.delete(expenseFlow);
			getResponse().getWriter().write("false");
		}
	}
	public void updateModel2Perform() throws Exception{
		ExpenseFlow expenseFlow = new ExpenseFlow();
		expenseFlow.setReason(expenseModel.getReason());
		expenseFlow.setTitle(expenseModel.getTitle());
		expenseFlow.setExpenseMoney(expenseModel.getExpenseMoney());
		Task task = taskService.createTaskQuery().taskId(taskId).singleResult();
		ActivitiBaseEntity entity = (ActivitiBaseEntity) taskService
				.getVariable(taskId, ProcessVariableEnum.model.toString());
		BeanUtil.copy(expenseFlow, entity);
		dao.update(entity);
		taskService.setVariable(task.getId(), ProcessVariableEnum.model.toString(), entity);
	}
}
