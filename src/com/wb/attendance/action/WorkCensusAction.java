package com.wb.attendance.action;

import java.io.IOException;
import java.io.InputStream;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Random;

import javax.annotation.Resource;

import org.apache.struts2.ServletActionContext;
import org.hibernate.criterion.DetachedCriteria;
import org.hibernate.criterion.MatchMode;
import org.hibernate.criterion.Restrictions;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;

import com.google.gson.Gson;
import com.soft.core.action.AbstractAction;
import com.soft.core.utils.JsonOperate;
import com.soft.work.dao.FlowCommentsDao;
import com.soft.work.domain.FlowComments;
import com.soft.work.domain.LeaveFlow;
import com.wb.attendance.dao.WorkCensusDao;
import com.wb.attendance.domain.OutApply;
import com.wb.attendance.domain.WorkExtra;
import com.wb.attendance.domain.WorkoutApply;
import com.wb.attendance.utils.ExportExcel;
import com.wb.attendance.utils.WorkCensusModel;
import com.wb.core.domain.Depart;
import com.wb.core.domain.UserInfo;

@Controller
@Scope("prototype")
public class WorkCensusAction extends AbstractAction {
	private WorkCensusDao dao;
	private WorkCensusModel attModel;
	private static final long serialVersionUID = 1L;
	private int userID;
	private FlowCommentsDao commentsDao;
	private String startTime;
	private String endTime;
	private ExportExcel exportExcel;

	public String getStartTime() {
		return startTime;
	}

	public void setStartTime(String startTime) {
		this.startTime = startTime;
	}

	public String getEndTime() {
		return endTime;
	}

	public void setEndTime(String endTime) {
		this.endTime = endTime;
	}

	public int getUserID() {
		return userID;
	}

	public void setUserID(int userID) {
		this.userID = userID;
	}

	public FlowCommentsDao getCommentsDao() {
		return commentsDao;
	}

	@Resource
	public void setCommentsDao(FlowCommentsDao commentsDao) {
		this.commentsDao = commentsDao;
	}

	public WorkCensusDao getDao() {
		return dao;
	}

	public ExportExcel getExportExcel() {
		return exportExcel;
	}

	@Resource
	public void setExportExcel(ExportExcel exportExcel) {
		this.exportExcel = exportExcel;
	}

	@Resource
	public void setDao(WorkCensusDao dao) {
		this.dao = dao;
	}

	public WorkCensusModel getAttModel() {
		return attModel;
	}

	public void setAttModel(WorkCensusModel attModel) {
		this.attModel = attModel;
	}

	public void getAll() throws Exception {
		String departID = request.getParameter("departName");
		DetachedCriteria criteria = DetachedCriteria.forClass(UserInfo.class);
		DetachedCriteria criteriaCount = DetachedCriteria
				.forClass(UserInfo.class);
		if (null != departID && !"".equals(departID)) {
			Depart depart = new Depart();
			try {
				depart.setId(Integer.parseInt(departID));
				criteria.add(Restrictions.eq("depart", depart));
				criteriaCount.add(Restrictions.eq("depart", depart));
			} catch (Exception e) {
			}
		}
		if (null != getQuery() && !"".equals(getQuery())) {
			criteria.add(Restrictions.like("userName", getQuery(),
					MatchMode.ANYWHERE));
			criteriaCount.add(Restrictions.like("userName", getQuery(),
					MatchMode.ANYWHERE));
		}
		List<WorkCensusModel> list = dao.getList(startTime, endTime, criteria,
				getStart(), getLimit());
		Gson gson = new Gson();
		String userAtts = gson.toJson(list);
		int size = dao.find(criteriaCount).size();
		getResponse().getWriter().write(
				JsonOperate.getpageJson(Long.parseLong(size + ""), userAtts));
	}

	public void getUserLeave() {
		DetachedCriteria criteria = DetachedCriteria.forClass(LeaveFlow.class);
		DetachedCriteria criteriaCount = DetachedCriteria
				.forClass(LeaveFlow.class);
		criteria.createAlias("user", "u");
		criteria.add(Restrictions.eq("u.id", userID));
		criteria.add(Restrictions.le("beginTime", endTime));
		criteria.add(Restrictions.ge("beginTime", startTime));
		criteria.add(Restrictions.eq("state", 3));
		criteriaCount.createAlias("user", "u");
		criteriaCount.add(Restrictions.eq("u.id", userID));
		criteriaCount.add(Restrictions.le("beginTime", endTime));
		criteriaCount.add(Restrictions.ge("beginTime", startTime));
		criteriaCount.add(Restrictions.eq("state", 3));
		String departID = request.getParameter("departName");
		if (null != departID && !"".equals(departID)) {
			Depart depart = new Depart();
			try {
				depart.setId(Integer.parseInt(departID));
				criteria.add(Restrictions.eq("u.depart", depart));
				criteriaCount.add(Restrictions.eq("u.depart", depart));
			} catch (Exception e) {
			}
		}
		List<LeaveFlow> list = dao.find(criteria, getStart(), getLimit());
		Long count = dao.getCount(criteriaCount, new LeaveFlow());
		try {
			getResponse().getWriter().write(
					JsonOperate.getpageJson(count, getListGson4Leave(list)));
		} catch (IOException e) {
			e.printStackTrace();
		}
	}

	public String getListGson4Leave(List<LeaveFlow> list) {
		StringBuffer sb = new StringBuffer();
		sb.append("[");
		for (LeaveFlow leaveFlow : list) {
			sb.append("{");
			sb.append("'id':'" + leaveFlow.getId() + "',");
			sb
					.append("'userName':'" + leaveFlow.getUser().getUserName()
							+ "',");
			sb.append("'isAllDay':'" + leaveFlow.isAllDay() + "',");
			sb.append("'applyDate':'" + leaveFlow.getApplyDate() + "',");
			sb.append("'beginTime':'" + leaveFlow.getBeginTime() + "',");
			sb.append("'endTime':'" + leaveFlow.getEndTime() + "',");
			sb.append("'title':'" + leaveFlow.getTitle() + "',");
			sb.append("'state':'" + leaveFlow.getState() + "',");
			sb.append("'comments':" + JsonFlowComments(leaveFlow.getId(), 1)
					+ ",");
			sb.append("'reason':'" + leaveFlow.getReason() + "'");
			sb.append("},");
		}
		if (list.size() > 0) {
			sb.deleteCharAt(sb.length() - 1);
		}
		sb.append("]");
		return sb.toString();
	}

	private String JsonFlowComments(int id, int type) {
		DetachedCriteria criteria = DetachedCriteria
				.forClass(FlowComments.class);
		criteria.add(Restrictions.eq("flowId", id));
		criteria.add(Restrictions.eq("flowType", type));
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

	public void getUserworkout() {
		DetachedCriteria criteria = DetachedCriteria
				.forClass(WorkoutApply.class);
		DetachedCriteria criteriaCount = DetachedCriteria
				.forClass(WorkoutApply.class);
		criteria.createAlias("userInfoByApplyUser", "u");
		criteria.add(Restrictions.eq("u.id", userID));
		criteria.add(Restrictions.le("startDate", endTime));
		criteria.add(Restrictions.ge("startDate", startTime));
		criteria.add(Restrictions.in("state",
				new Object[] { "2", "4", "5", "6" }));
		criteriaCount.createAlias("userInfoByApplyUser", "u");
		criteriaCount.add(Restrictions.eq("u.id", userID));
		criteriaCount.add(Restrictions.le("startDate", endTime));
		criteriaCount.add(Restrictions.ge("startDate", startTime));
		criteriaCount.add(Restrictions.in("state", new Object[] { "2", "4",
				"5", "6" }));
		String departID = request.getParameter("departName");
		if (null != departID && !"".equals(departID)) {
			Depart depart = new Depart();
			try {
				depart.setId(Integer.parseInt(departID));
				criteria.add(Restrictions.eq("u.depart", depart));
				criteriaCount.add(Restrictions.eq("u.depart", depart));
			} catch (Exception e) {
			}
		}
		List<WorkoutApply> list = dao.find(criteria, getStart(), getLimit());
		Long count = dao.getCount(criteriaCount, new WorkoutApply());
		try {
			getResponse().getWriter().write(
					JsonOperate.getpageJson(count, getListGson4Workout(list)));
		} catch (IOException e) {
			e.printStackTrace();
		}
	}

	public String getListGson4Workout(List<WorkoutApply> list) {
		StringBuffer sb = new StringBuffer();
		sb.append("[");
		for (WorkoutApply workout : list) {
			sb.append("{");
			sb.append("'id':'" + workout.getId() + "',");
			sb.append("'beginTime':'" + workout.getStartDate() + "',");
			sb.append("'endTime':'" + workout.getEndDate() + "',");
			sb.append("'isAllDay':" + workout.isAllDay() + ",");
			sb.append("'reallyEndDate':'" + workout.getReallyEndDate() + "',");
			sb.append("'outAddress':'" + workout.getOutAddress() + "',");
			sb.append("'applyDate':'" + workout.getApplyDate() + "',");
			sb.append("'state':'" + workout.getState() + "',");
			sb.append("'comments':" + JsonFlowComments(workout.getId(), 5)
					+ ",");
			sb.append("'reason':'" + workout.getReason() + "'");
			sb.append("},");
		}
		if (list.size() > 0) {
			sb.deleteCharAt(sb.length() - 1);
		}
		sb.append("]");
		return sb.toString();
	}

	public void getUseroutApply() {
		DetachedCriteria criteria = DetachedCriteria.forClass(OutApply.class);
		DetachedCriteria criteriaCount = DetachedCriteria
				.forClass(OutApply.class);
		UserInfo user = new UserInfo();
		criteria.createAlias("userInfoByApplyUser", "u");
		criteria.add(Restrictions.eq("u.id", userID));
		criteria.add(Restrictions.le("applyDate", endTime));
		criteria.add(Restrictions.ge("applyDate", startTime));
		criteria.add(Restrictions.in("state",
				new Object[] { "2", "4", "5", "6" }));
		criteriaCount.createAlias("userInfoByApplyUser", "u");
		criteriaCount.add(Restrictions.eq("u.id", userID));
		criteriaCount.add(Restrictions.le("applyDate", endTime));
		criteriaCount.add(Restrictions.ge("applyDate", startTime));
		criteriaCount.add(Restrictions.in("state", new Object[] { "2", "4",
				"5", "6" }));
		String departID = request.getParameter("departName");
		if (null != departID && !"".equals(departID)) {
			Depart depart = new Depart();
			try {
				depart.setId(Integer.parseInt(departID));
				criteria.add(Restrictions.eq("u.depart", depart));
				criteriaCount.add(Restrictions.eq("u.depart", depart));
			} catch (Exception e) {
			}
		}
		List<OutApply> list = dao.find(criteria);
		Long count = dao.getCount(criteriaCount, new OutApply());
		try {
			getResponse().getWriter().write(
					JsonOperate.getpageJson(count, getListGson4outApply(list)));
		} catch (IOException e) {
			e.printStackTrace();
		}

	}

	public String getListGson4outApply(List<OutApply> list) {
		StringBuffer sb = new StringBuffer();
		sb.append("[");
		for (OutApply outApply : list) {
			sb.append("{");
			sb.append("'id':'" + outApply.getId() + "',");
			sb.append("'beginTime':'" + outApply.getStartDate() + "',");
			sb.append("'endTime':'" + outApply.getEndDate() + "',");
			sb.append("'reallyEndDate':'" + outApply.getReallyEndDate() + "',");
			sb.append("'applyDate':'" + outApply.getApplyDate() + "',");
			sb.append("'state':'" + outApply.getState() + "',");
			sb.append("'comments':" + JsonFlowComments(outApply.getId(), 4)
					+ ",");
			sb.append("'reason':'" + outApply.getReason() + "'");
			sb.append("},");
		}
		if (list.size() > 0) {
			sb.deleteCharAt(sb.length() - 1);
		}
		sb.append("]");
		return sb.toString();
	}

	public void getUserworkExtra() {
		DetachedCriteria criteria = DetachedCriteria.forClass(WorkExtra.class);
		DetachedCriteria criteriaCount = DetachedCriteria
				.forClass(WorkExtra.class);
		UserInfo user = new UserInfo();
		criteria.createAlias("userInfoByApplyUser", "u");
		criteria.add(Restrictions.eq("u.id", userID));
		criteria.add(Restrictions.le("startDate", endTime));
		criteria.add(Restrictions.ge("startDate", startTime));
		criteria.add(Restrictions.in("state",
				new Object[] { "2", "4", "5", "6" }));
		criteriaCount.createAlias("userInfoByApplyUser", "u");
		criteriaCount.add(Restrictions.eq("u.id", userID));
		criteriaCount.add(Restrictions.le("startDate", endTime));
		criteriaCount.add(Restrictions.ge("startDate", startTime));
		criteriaCount.add(Restrictions.in("state", new Object[] { "2", "4",
				"5", "6" }));
		String departID = request.getParameter("departName");
		if (null != departID && !"".equals(departID)) {
			Depart depart = new Depart();
			try {
				depart.setId(Integer.parseInt(departID));
				criteria.add(Restrictions.eq("u.depart", depart));
				criteriaCount.add(Restrictions.eq("u.depart", depart));
			} catch (Exception e) {
			}
		}
		List<WorkExtra> list = dao.find(criteria);
		Long count = dao.getCount(criteriaCount, new OutApply());
		try {
			getResponse().getWriter()
					.write(
							JsonOperate.getpageJson(count,
									getListGson4workExtra(list)));
		} catch (IOException e) {
			e.printStackTrace();
		}

	}

	public String getListGson4workExtra(List<WorkExtra> list) {
		StringBuffer sb = new StringBuffer();
		sb.append("[");
		for (WorkExtra workExtra : list) {
			sb.append("{");
			sb.append("'id':'" + workExtra.getId() + "',");
			sb.append("'beginTime':'" + workExtra.getStartDate() + "',");
			sb.append("'endTime':'" + workExtra.getEstimateEndDate() + "',");
			sb.append("'isAllDay':" + workExtra.isAllDay() + ",");
			sb
					.append("'reallyEndDate':'" + workExtra.getReallyEndDate()
							+ "',");
			sb.append("'applyDate':'" + workExtra.getApplyDate() + "',");
			sb.append("'state':'" + workExtra.getState() + "',");
			sb.append("'comments':" + JsonFlowComments(workExtra.getId(), 3)
					+ ",");
			sb.append("'reason':'" + workExtra.getReason() + "'");
			sb.append("},");
		}
		if (list.size() > 0) {
			sb.deleteCharAt(sb.length() - 1);
		}
		sb.append("]");
		return sb.toString();
	}

	public void exportExcel() throws Exception {
		String departID = request.getParameter("departName");
		DetachedCriteria criteria = DetachedCriteria.forClass(UserInfo.class);
		Depart dep = null;
		if (null != departID && !"".equals(departID)) {
			Depart depart = new Depart();
			try {
				depart.setId(Integer.parseInt(departID));
				criteria.add(Restrictions.eq("depart", depart));
				DetachedCriteria cd = DetachedCriteria.forClass(Depart.class);
				cd.add(Restrictions.eq("id", Integer.parseInt(departID)));
				dep = (Depart) dao.find(cd).get(0);
			} catch (Exception e) {
			}
		}
		if (null != getQuery() && !"".equals(getQuery())) {
			criteria.add(Restrictions.like("userName", getQuery(),
					MatchMode.ANYWHERE));
		}
		List<WorkCensusModel> list = dao.getList(startTime, endTime, criteria,
				getStart(), getLimit());
		SimpleDateFormat format = new SimpleDateFormat("yyyyMMddHHmmss");
		Random random = new Random();
		String path = request.getRealPath("excel");
		String really = format.format(new Date()) + random.nextInt(1000000)
				+ "_";
		String reallyPath = path + "/" + really;
		exportExcel.exportExc(list, reallyPath, startTime, endTime,dep);
		getResponse().getWriter().write(really + "考勤统计.xls");
	}

	private String fileName;

	public String getFileName() {
		return fileName;
	}

	public void setFileName(String fileName) throws Exception {
		this.fileName = new String(fileName.getBytes("ISO-8859-1"), "UTF-8");
	}

	// 从下载文件原始存放路径读取得到文件输出流
	private boolean exist = true;

	public InputStream getDownloadFile() throws Exception {
		InputStream input = ServletActionContext.getServletContext()
				.getResourceAsStream("/excel/" + fileName);
		if (null != input) {
			return input;
		} else {
			exist = false;
			return ServletActionContext.getServletContext()
					.getResourceAsStream("/excel/" + "原文件丢失.xls");
		}
	}

	public String getDownloadChineseFileName() throws Exception {
		String downloadChineseFileName = fileName;
		try {
			downloadChineseFileName = new String(downloadChineseFileName
					.getBytes(), "ISO-8859-1");
			downloadChineseFileName = downloadChineseFileName
					.substring(downloadChineseFileName.indexOf("_") + 1);
			if (!exist) {
				downloadChineseFileName = "The original file is missing";
			}
		} catch (Exception e) {
		}
		return downloadChineseFileName;
	}

	public String execute() {
		return SUCCESS;
	}
}
