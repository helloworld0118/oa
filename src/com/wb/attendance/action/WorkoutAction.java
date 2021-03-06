package com.wb.attendance.action;

import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import javax.annotation.Resource;
import org.hibernate.criterion.DetachedCriteria;
import org.hibernate.criterion.MatchMode;
import org.hibernate.criterion.Order;
import org.hibernate.criterion.Restrictions;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;
import com.soft.core.action.AbstractAction;
import com.soft.core.utils.BeanUtil;
import com.soft.core.utils.JsonOperate;
import com.soft.core.utils.PositionEnum;
import com.soft.work.dao.FlowCommentsDao;
import com.soft.work.domain.FlowComments;
import com.wb.attendance.dao.WorkoutDao;
import com.wb.attendance.domain.WorkoutApply;
import com.wb.attendance.utils.WorkoutModel;
import com.wb.core.domain.UserInfo;

@Controller
@Scope("prototype")
public class WorkoutAction extends AbstractAction {
	/**
	 * 
	 */
	private static final long serialVersionUID = -6923331969975699698L;
	private WorkoutDao dao;
	private FlowCommentsDao commentsDao;
	private WorkoutModel workoutModel;

	@Resource
	public void setCommentsDao(FlowCommentsDao commentsDao) {
		this.commentsDao = commentsDao;
	}

	@Resource
	public void setDao(WorkoutDao dao) {
		this.dao = dao;
	}

	public WorkoutModel getWorkoutModel() {
		return workoutModel;
	}

	public void setWorkoutModel(WorkoutModel workoutModel) {
		this.workoutModel = workoutModel;
	}

	public void getAll() {
		DetachedCriteria queryCriteria = null;
		queryCriteria = DetachedCriteria.forClass(WorkoutApply.class);
		queryCriteria.add(Restrictions.eq("userInfoByApplyUser",
				getCurrentUser()));
		DetachedCriteria criteriaCount = DetachedCriteria
				.forClass(WorkoutApply.class);
		criteriaCount.add(Restrictions.eq("userInfoByApplyUser",
				getCurrentUser()));
		if (null != getQuery() && !"".equals(getQuery())) {
			if(!"0".equals(getQuery())){
				queryCriteria.add(Restrictions.like("state", getQuery(),
						MatchMode.ANYWHERE));
				criteriaCount.add(Restrictions.like("state", getQuery(),
						MatchMode.ANYWHERE));
			}
		}
		queryCriteria.addOrder(Order.desc("id"));
		List<WorkoutApply> lists = dao.find(queryCriteria, getStart(), getLimit());
		Long count = dao.getCount(criteriaCount, new WorkoutApply());
		try {
			getResponse().getWriter().write(
					JsonOperate.getpageJson(count, getListGson4me(lists)));
		} catch (IOException e) {
			e.printStackTrace();
		}
	}

	public String getListGson4me(List<WorkoutApply> list) {
		StringBuffer sb = new StringBuffer();
		sb.append("[");
		for (WorkoutApply workout : list) {
			sb.append("{");
			sb.append("'id':'" + workout.getId() + "',");
			sb.append("'beginTime':'" + workout.getStartDate() + "',");
			sb.append("'endTime':'" + workout.getEndDate()
					+ "',");
			sb.append("'isAllDay':"+workout.isAllDay()+",");
			sb.append("'reallyEndDate':'" + workout.getReallyEndDate()
							+ "',");
			sb.append("'outAddress':'" + workout.getOutAddress() + "',");
			sb.append("'applyDate':'" + workout.getApplyDate() + "',");
			sb.append("'state':'" + workout.getState() + "',");
			sb.append("'comments':" + JsonFlowComments(workout) + ",");
			sb.append("'reason':'" + workout.getReason() + "'");
			sb.append("},");
		}
		if (list.size() > 0) {
			sb.deleteCharAt(sb.length() - 1);
		}
		sb.append("]");
		return sb.toString();
	}

	private String JsonFlowComments(WorkoutApply model) {
		DetachedCriteria criteria = DetachedCriteria
				.forClass(FlowComments.class);
		criteria.add(Restrictions.eq("flowId", model.getId()));
		criteria.add(Restrictions.eq("flowType", 5));
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
		try {
			WorkoutApply workout = new WorkoutApply();
			workout.setEndDate(workoutModel.getEndDate());
			workout.setAllDay(Boolean.parseBoolean(workoutModel
					.getIsAllDay()));
			workout.setStartDate(workoutModel.getStartDate());
			workout.setReason(workoutModel.getReason());
			workout.setOutAddress(workoutModel.getOutAddress());
			workout.setReallyEndDate("");
			workout.setState("1");
			UserInfo userInfo = getCurrentUser();
			workout.setUserInfoByApplyUser(userInfo);
			workout.setUserInfoByExamineUser(findDeptManager2User(userInfo));
			SimpleDateFormat format = new SimpleDateFormat(
					"yyyy-MM-dd HH:mm:ss");
			workout.setApplyDate(format.format(new Date()));
			dao.add(workout);
			getResponse().getWriter().write("true");
		} catch (Exception e) {
			e.printStackTrace();
			getResponse().getWriter().write("false");
		}
	}
    public void getTask(){
    	DetachedCriteria queryCriteria=DetachedCriteria.forClass(WorkoutApply.class);
    	DetachedCriteria criteriaCount=DetachedCriteria.forClass(WorkoutApply.class);
    	queryCriteria.add(Restrictions.eq("userInfoByExamineUser", getCurrentUser()));
    	criteriaCount.add(Restrictions.eq("userInfoByExamineUser", getCurrentUser()));
    	queryCriteria.addOrder(Order.desc("id"));
    	List<String> states=new ArrayList<String>();
    	states.add("1");
    	states.add("4");
    	states.add("7");
    	queryCriteria.add(Restrictions.in("state",states));
    	criteriaCount.add(Restrictions.in("state",states));
    	if (null != getQuery() && !"".equals(getQuery())) {
			queryCriteria.add(Restrictions.like("userInfoByApplyUser", getQuery(),
					MatchMode.ANYWHERE));
			criteriaCount.add(Restrictions.like("userInfoByApplyUser", getQuery(),
					MatchMode.ANYWHERE));
		}
		List<WorkoutApply> lists = dao.find(queryCriteria, getStart(), getLimit());
		Long count = dao.getCount(criteriaCount, new WorkoutApply());
		try {
			getResponse().getWriter().write(
					JsonOperate.getpageJson(count, getListGson4Ower(lists)));
		} catch (IOException e) {
			e.printStackTrace();
		}
    	
    }
    public String getListGson4Ower(List<WorkoutApply> list) {
		StringBuffer sb = new StringBuffer();
		sb.append("[");
		for (WorkoutApply workout : list) {
			sb.append("{");
			sb.append("'id':'" + workout.getId() + "',");
			sb.append("'startDate':'" + workout.getStartDate() + "',");
			sb.append("'reallyEndDate':'" + workout.getReallyEndDate()
					+ "',");
			sb.append("'endDate':'" + workout.getEndDate()
					+ "',");
			sb.append("'userInfoByApplyUser':'" + workout.getUserInfoByApplyUser().getUserName()
							+ "',");
			sb.append("'outAddress':'" + workout.getOutAddress() + "',");
			sb.append("'applyDate':'" + workout.getApplyDate() + "',");
			sb.append("'state':'" + workout.getState() + "',");
			sb.append("'reason':'" + workout.getReason() + "'");
			sb.append("},");
		}
		if (list.size() > 0) {
			sb.deleteCharAt(sb.length() - 1);
		}
		sb.append("]");
		return sb.toString();
	}
	public UserInfo findDeptManager2User(UserInfo user) {
		DetachedCriteria criteria = DetachedCriteria.forClass(UserInfo.class);
		criteria.createAlias("depart", "d");
		criteria.createAlias("position", "p");
		criteria.add(Restrictions.eq("p.positionName",
				PositionEnum.departManager.getValue()));
		criteria.add(Restrictions.eq("d.id", user.getDepart().getId()));
		return (UserInfo) dao.find(criteria).get(0);
	}
	public void updateAll() throws Exception{
		WorkoutApply target = dao.get(workoutModel.getId());
		target.setAllDay(Boolean.parseBoolean(workoutModel.getIsAllDay()));
		target.setEndDate(workoutModel.getEndDate());
		target.setStartDate(workoutModel.getStartDate());
		target.setReason(workoutModel.getReason());
		target.setOutAddress(workoutModel.getOutAddress());
		target.setState("1");
		dao.update(target);
		getResponse().getWriter().write("true");
	}
	public void update() throws Exception {
		WorkoutApply target = dao.get(workoutModel.getId());
		WorkoutApply source=new WorkoutApply();
		source.setState(workoutModel.getState());
		BeanUtil.copy(source, target);
		String comment=request.getParameter("workoutCommentFiled");
		if(workoutModel.getState().equals("4")){
			SimpleDateFormat format = new SimpleDateFormat(
			"yyyy-MM-dd HH:mm:ss");
			target.setReallyEndDate(format.format(new Date()));
		}
		if(null!=comment&&!"".equals(comment)){
			FlowComments comments=new FlowComments();
			comments.setFlowId(target.getId());
			comments.setFlowType(5);
			comments.setMsg(comment);
			comments.setUserName(getCurrentUser().getUserName());
			commentsDao.add(comments);
		}
		dao.update(target);
		getResponse().getWriter().write("true");
	}
	public void delete() throws Exception{
		WorkoutApply extra=new WorkoutApply();
		extra.setId(workoutModel.getId());
		dao.delete(extra);
		getResponse().getWriter().write("true");
	}
}
