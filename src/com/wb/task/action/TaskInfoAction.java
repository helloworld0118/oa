package com.wb.task.action;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.Serializable;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Random;

import javax.annotation.Resource;

import org.hibernate.criterion.Criterion;
import org.hibernate.criterion.DetachedCriteria;
import org.hibernate.criterion.MatchMode;
import org.hibernate.criterion.Order;
import org.hibernate.criterion.Restrictions;
import org.hibernate.criterion.SimpleExpression;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;

import com.soft.core.action.AbstractAction;
import com.soft.core.utils.BeanUtil;
import com.soft.core.utils.JsonOperate;
import com.wb.core.domain.UserInfo;
import com.wb.task.dao.TaskInfoDao;
import com.wb.task.domain.TaskAttchment;
import com.wb.task.domain.TaskEvent;
import com.wb.task.domain.TaskInfo;

@Controller
@Scope("prototype")
public class TaskInfoAction extends AbstractAction {
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	private TaskInfoDao dao;
	private TaskInfo taskInfo;
	private File taskAtt;
	private String taskAttFileName;

	public File getTaskAtt() {
		return taskAtt;
	}

	public void setTaskAtt(File taskAtt) {
		this.taskAtt = taskAtt;
	}

	public String getTaskAttFileName() {
		return taskAttFileName;
	}

	public void setTaskAttFileName(String taskAttFileName) {
		this.taskAttFileName = taskAttFileName;
	}

	public TaskInfoDao getDao() {
		return dao;
	}

	@Resource
	public void setDao(TaskInfoDao dao) {
		this.dao = dao;
	}

	public TaskInfo getTaskInfo() {
		return taskInfo;
	}

	public void setTaskInfo(TaskInfo taskInfo) {
		this.taskInfo = taskInfo;
	}

	public void getTaskList() throws Exception {
		DetachedCriteria criteria = DetachedCriteria.forClass(TaskInfo.class);
		UserInfo current = getCurrentUser();
		SimpleExpression query1 = Restrictions.eq("userInfoByArrangeUser",
				current);
		SimpleExpression query2 = Restrictions.eq("userInfoByResponsibleUser",
				current);
		SimpleExpression query3 = Restrictions.eq("userInfoByExamineUser",
				current);
		SimpleExpression query4 = Restrictions.like("partakeUsers", "("
				+ current.getId() + ")", MatchMode.ANYWHERE);
		criteria.add(Restrictions.or(new Criterion[] { query1, query2, query3,
				query4 }));
		DetachedCriteria criteriaCount = DetachedCriteria
				.forClass(TaskInfo.class);
		criteriaCount.add(Restrictions.or(new Criterion[] { query1, query2,
				query3, query4 }));
		if (null != getQuery() && !"".equals(getQuery())) {
			criteria.add(Restrictions.like("title", getQuery(),
					MatchMode.ANYWHERE));
			criteriaCount.add(Restrictions.like("title", getQuery(),
					MatchMode.ANYWHERE));
		}
		criteria.addOrder(Order.desc("id"));
		List<TaskInfo> list = dao.find(criteria);
		long count = dao.getCount(criteriaCount, new TaskInfo());
		try {
			getResponse().getWriter().write(
					JsonOperate.getpageJson(count, getListGson4Task(list)));
		} catch (IOException e) {
			e.printStackTrace();
		}
	}

	public String getListGson4Task(List<TaskInfo> list) throws Exception {
		StringBuffer sb = new StringBuffer();
		UserInfo user = getCurrentUser();
		sb.append("[");
		for (TaskInfo taskInfo : list) {
			sb.append("{");
			sb.append("'id':'" + taskInfo.getId() + "',");
			sb.append("'arrangeUser':'"
					+ taskInfo.getUserInfoByArrangeUser().getUserName() + "("
					+ taskInfo.getUserInfoByArrangeUser().getId() + ")" + "',");
			sb.append("'responsibleUser':'"
					+ taskInfo.getUserInfoByResponsibleUser().getUserName()
					+ "(" + taskInfo.getUserInfoByResponsibleUser().getId()
					+ ")" + "',");
			if (null != taskInfo.getUserInfoByExamineUser()) {
				sb.append("'examineUser':'"
						+ toNull(taskInfo.getUserInfoByExamineUser()
								.getUserName()) + "("
						+ taskInfo.getUserInfoByExamineUser().getId() + ")"
						+ "',");
			}
			sb.append("'title':'" + taskInfo.getTitle());
			if (null != taskInfo.getIsUrge()
					&& taskInfo.getIsUrge()
					&& taskInfo.getUserInfoByResponsibleUser().getId().equals(
							user.getId())) {
				sb.append("<br/><b style=\"color:red\">任务被催办，请加紧进度</b>");
			}
			if (taskInfo.getState() == 1
					&& taskInfo.getUserInfoByResponsibleUser().getId().equals(
							user.getId())) {

				sb.append("<br/><b style=\"color:red\">你是任务负责人，需要接收</b>");
			} else if (taskInfo.getState() == 2
					&& taskInfo.getUserInfoByResponsibleUser().getId().equals(
							user.getId())) {
				sb.append("<br/><b style=\"color:red\">你是任务负责人，请注意及时汇报进度</b>");

			} else if (taskInfo.getState() == 3
					&& taskInfo.getUserInfoByArrangeUser().getId().equals(
							user.getId())) {
				sb.append("<br/><b style=\"color:red\">你是任务布置人，请修改或删除</b>");

			} else if (taskInfo.getState() == 4
					&& taskInfo.getUserInfoByArrangeUser().getId().equals(
							user.getId())) {
				sb.append("<br/><b style=\"color:red\">你是任务布置人，请审核本任务</b>");

			} else if (taskInfo.getState() == 7
					&& taskInfo.getUserInfoByExamineUser().getId().equals(
							user.getId())) {
				sb.append("<br/><b style=\"color:red\">该任务需要你的批准</b>");
			} else if (taskInfo.getState() == 8
					&& taskInfo.getUserInfoByArrangeUser().getId().equals(
							user.getId())) {
				sb.append("<br/><b style=\"color:red\">你是任务布置人，请修改或删除</b>");
			}

			sb.append("',");
			sb.append("'predictHours':'" + toNull(taskInfo.getPredictHours())
					+ "',");
			sb.append("'arrangeTime':'" + taskInfo.getArrangeTime() + "',");
			sb.append("'beginTime':'" + taskInfo.getBeginTime() + "',");
			sb.append("'overTime':'" + taskInfo.getOverTime() + "',");
			sb.append("'isAllDay':" + taskInfo.getIsAllDay() + ",");
			sb.append("'startTime':'" + toNull(taskInfo.getStartTime()) + "',");
			sb.append("'endTime':'" + toNull(taskInfo.getEndTime()) + "',");
			sb.append("'content':'" + toNull(taskInfo.getContent()) + "',");
			sb.append("'rewardOrpenaltie':'"
					+ toNull(taskInfo.getRewardOrpenaltie()) + "',");
			sb.append("'leadAdvice':'" + toNull(taskInfo.getLeadAdvice())
					+ "',");
			sb.append("'state':'");
			if (taskInfo.getState() == 1) {
				sb.append("<span id=\"1\" style=\"color:#66CC00\">等待接收</span>");
			} else if (taskInfo.getState() == 2) {
				sb
						.append("<span  id=\"2\" style=\"color:#3399CC\">进行中</span>(<span style=\"color:red\">"
								+ taskInfo.getRate() + "%</span>)");
				SimpleDateFormat format = new SimpleDateFormat(
						"yyyy-MM-dd HH:mm:ss");
				Date overTime = null;
				try {
					overTime = format.parse(taskInfo.getOverTime().trim());
				} catch (Exception e) {
					format = new SimpleDateFormat("yyyy-MM-dd");
					overTime = format.parse(taskInfo.getOverTime().trim());
				}
				if (overTime.getTime() < new Date().getTime()) {
					sb.append("<br/><b style=\"color:red\">已超期</b>");
				}
			} else if (taskInfo.getState() == 3) {
				sb.append("<span  id=\"3\" style=\"color:red\">拒绝接收</span>");
			} else if (taskInfo.getState() == 4) {
				sb
						.append("<span  id=\"4\" style=\"color:#3333FF\">提交审核</span>");
			} else if (taskInfo.getState() == 5) {
				sb.append("任务完成(<span  id=\"5\" style=\"color:red\">"
						+ taskInfo.getScore() + "分</span>)");
			} else if (taskInfo.getState() == 6) {
				sb
						.append("<span  id=\"6\" style=\"color:#999999\">任务撤消</span>");
			} else if (taskInfo.getState() == 7) {
				sb
						.append("<span  id=\"7\" style=\"color:#FF0000\">等待审批</span>");
			} else if (taskInfo.getState() == 8) {
				sb.append("<span  id=\"8\" style=\"color:red\">审批不通过</span>");
			}
			sb.append("',");
			sb.append("'isExamine':" + taskInfo.getIsExamine() + ",");
			sb.append("'score':'" + toNull(taskInfo.getScore()) + "',");
			sb.append("'rate':'" + toNull(taskInfo.getRate()) + "%',");
			sb.append("'isUrge':" + taskInfo.getIsUrge() + ",");
			sb.append("'urgeContent':'" + toNull(taskInfo.getUrgeContent())
					+ "',");
			sb.append("'partakeUsers':'" + toNull(taskInfo.getPartakeUsers())
					+ "'");
			sb.append("},");
		}
		if (list.size() > 0) {
			sb.deleteCharAt(sb.length() - 1);
		}
		sb.append("]");
		return sb.toString();
	}

	private String toNull(Object object) {
		if (null == object) {
			return "";
		} else {
			return object.toString();
		}
	}

	public void addTask() throws Exception {
		TaskInfo task = new TaskInfo();
		task.setTitle(request.getParameter("title"));
		task.setContent(request.getParameter("content"));
		task.setPredictHours(Integer.parseInt(request
				.getParameter("predictHours")));
		SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		task.setArrangeTime(format.format(new Date()));
		task.setBeginTime(request.getParameter("beginTime"));
		task.setOverTime(request.getParameter("endTime"));
		task
				.setIsAllDay(Boolean.parseBoolean(request
						.getParameter("isAllDay")));
		task.setState(1);
		task.setIsUrge(false);
		task.setUserInfoByArrangeUser(getCurrentUser());
		if (null != request.getParameter("isExamine")
				&& request.getParameter("isExamine").equals("on")) {
			task.setState(7);
			UserInfo examineUser = new UserInfo();
			String exam = request.getParameter("examineUser");
			examineUser.setId(Integer.parseInt(exam.substring(
					exam.indexOf("(") + 1, exam.length() - 1)));
			task.setUserInfoByExamineUser(examineUser);
			task.setIsExamine(true);
		} else {
			task.setIsExamine(false);
		}

		UserInfo responsibleUser = new UserInfo();
		String responsibleUserID = request.getParameter("responsibleUser");
		responsibleUser.setId(Integer.parseInt(responsibleUserID.substring(
				responsibleUserID.indexOf("(") + 1,
				responsibleUserID.length() - 1)));
		task.setUserInfoByResponsibleUser(responsibleUser);
		task.setPartakeUsers(request.getParameter("partakeUsers"));
		try {
			Serializable id = dao.add(task);
			TaskEvent taskEvent = new TaskEvent();
			taskInfo = new TaskInfo();
			taskInfo.setId(Integer.parseInt(id.toString()));
			taskEvent.setTaskInfo(taskInfo);
			taskEvent.setTime(format.format(new Date()));
			taskEvent.setContent("布置了一个任务");
			taskEvent.setType(1);
			taskEvent.setOperateUser(getCurrentUser().getUserName());
			dao.add(taskEvent);
			getResponse().getWriter().write("{success:true,msg:''}");
		} catch (Exception e) {
			getResponse().getWriter().write("{success:false,msg:''}");
		}
	}

	public void update() throws Exception {
		TaskInfo target = dao.get(taskInfo.getId());
		BeanUtil.copy(taskInfo, target);
		try {
			dao.update(target);
			getResponse().getWriter().write("true");
		} catch (Exception e) {
			getResponse().getWriter().write("false");
		}
	}

	public void updateAll() throws Exception {
		if (null == taskInfo) {
			taskInfo = new TaskInfo();
		}
		taskInfo.setTitle(request.getParameter("title"));
		taskInfo.setContent(request.getParameter("content"));
		taskInfo.setPredictHours(Integer.parseInt(request
				.getParameter("predictHours")));
		SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		taskInfo.setArrangeTime(format.format(new Date()));
		taskInfo.setBeginTime(request.getParameter("beginTime"));
		taskInfo.setOverTime(request.getParameter("endTime"));
		taskInfo.setIsAllDay(Boolean.parseBoolean(request
				.getParameter("isAllDay")));
		taskInfo.setState(1);
		taskInfo.setIsUrge(false);
		taskInfo.setUserInfoByArrangeUser(getCurrentUser());
		if (null != request.getParameter("isExamine")
				&& request.getParameter("isExamine").equals("on")) {
			taskInfo.setState(7);
			UserInfo examineUser = new UserInfo();
			String exam = request.getParameter("examineUser");
			examineUser.setId(Integer.parseInt(exam.substring(
					exam.indexOf("(") + 1, exam.length() - 1)));
			taskInfo.setUserInfoByExamineUser(examineUser);
			taskInfo.setIsExamine(true);
		} else {
			taskInfo.setIsExamine(false);
		}
		UserInfo responsibleUser = new UserInfo();
		String responsibleUserID = request.getParameter("responsibleUser");
		responsibleUser.setId(Integer.parseInt(responsibleUserID.substring(
				responsibleUserID.indexOf("(") + 1,
				responsibleUserID.length() - 1)));
		taskInfo.setUserInfoByResponsibleUser(responsibleUser);
		taskInfo.setPartakeUsers(request.getParameter("partakeUsers"));
		TaskInfo target = dao.get(taskInfo.getId());
		BeanUtil.copy(taskInfo, target);
		try {
			dao.update(target);
			getResponse().getWriter().write("true");
		} catch (Exception e) {
			getResponse().getWriter().write("false");
		}
	}

	public void delete() throws IOException {
		try {
			dao.delete(taskInfo);
			getResponse().getWriter().write("true");
		} catch (Exception e) {
			getResponse().getWriter().write("false");
		}
	}

	public void isCurrentUser() throws Exception {
		String taskResponsibleUserUser = request
				.getParameter("taskResponsibleUserUser");
		String taskArrangeUser = request.getParameter("taskArrangeUser");
		String taskExamineUser = request.getParameter("taskExamineUser");
		boolean ok1 = taskResponsibleUserUser.indexOf(getCurrentUser().getId()
				.toString()) >= 0;
		boolean ok2 = taskArrangeUser.indexOf(getCurrentUser().getId()
				.toString()) >= 0;
		boolean ok3 = taskExamineUser.indexOf(getCurrentUser().getId()
				.toString()) >= 0;
		int i = 0;
		if (ok1 && ok2 && ok3) {
			i = 7;
		} else if (ok2 && ok3) {
			i = 6;
		} else if (ok1 && ok3) {
			i = 5;
		} else if (ok1 && ok2) {
			i = 4;
		} else if (ok3) {
			i = 3;
		} else if (ok2) {
			i = 2;
		} else if (ok1) {
			i = 1;
		}
		getResponse().getWriter().write(i + "");
	}
}
