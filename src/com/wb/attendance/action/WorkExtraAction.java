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
import com.wb.attendance.dao.WorkExtraDao;
import com.wb.attendance.domain.WorkExtra;
import com.wb.attendance.utils.WorkExtraModel;
import com.wb.core.domain.UserInfo;

@Controller
@Scope("prototype")
public class WorkExtraAction extends AbstractAction {
	/**
	 * 
	 */
	private static final long serialVersionUID = -6923331969975699698L;
	private WorkExtraDao dao;
	private FlowCommentsDao commentsDao;
	private WorkExtraModel workExtraModel;

	@Resource
	public void setCommentsDao(FlowCommentsDao commentsDao) {
		this.commentsDao = commentsDao;
	}

	@Resource
	public void setDao(WorkExtraDao dao) {
		this.dao = dao;
	}

	public WorkExtraModel getWorkExtraModel() {
		return workExtraModel;
	}

	public void setWorkExtraModel(WorkExtraModel workExtraModel) {
		this.workExtraModel = workExtraModel;
	}

	public void getAll() {
		DetachedCriteria queryCriteria = null;
		queryCriteria = DetachedCriteria.forClass(WorkExtra.class);
		queryCriteria.add(Restrictions.eq("userInfoByApplyUser",
				getCurrentUser()));
		DetachedCriteria criteriaCount = DetachedCriteria
				.forClass(WorkExtra.class);
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
		List<WorkExtra> lists = dao.find(queryCriteria, getStart(), getLimit());
		Long count = dao.getCount(criteriaCount, new WorkExtra());
		try {
			getResponse().getWriter().write(
					JsonOperate.getpageJson(count, getListGson4me(lists)));
		} catch (IOException e) {
			e.printStackTrace();
		}
	}

	public String getListGson4me(List<WorkExtra> list) {
		StringBuffer sb = new StringBuffer();
		sb.append("[");
		for (WorkExtra workExtra : list) {
			sb.append("{");
			sb.append("'id':'" + workExtra.getId() + "',");
			sb.append("'beginTime':'" + workExtra.getStartDate() + "',");
			sb.append("'endTime':'" + workExtra.getEstimateEndDate()
					+ "',");
			sb.append("'isAllDay':"+workExtra.isAllDay()+",");
			sb.append("'reallyEndDate':'" + workExtra.getReallyEndDate()
							+ "',");
			sb.append("'applyDate':'" + workExtra.getApplyDate() + "',");
			sb.append("'state':'" + workExtra.getState() + "',");
			sb.append("'comments':" + JsonFlowComments(workExtra) + ",");
			sb.append("'reason':'" + workExtra.getReason() + "'");
			sb.append("},");
		}
		if (list.size() > 0) {
			sb.deleteCharAt(sb.length() - 1);
		}
		sb.append("]");
		return sb.toString();
	}

	private String JsonFlowComments(WorkExtra model) {
		DetachedCriteria criteria = DetachedCriteria
				.forClass(FlowComments.class);
		criteria.add(Restrictions.eq("flowId", model.getId()));
		criteria.add(Restrictions.eq("flowType", 3));
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
			WorkExtra workExtra = new WorkExtra();
			workExtra.setEstimateEndDate(workExtraModel.getEstimateEndDate());
			workExtra.setAllDay(Boolean.parseBoolean(workExtraModel
					.getIsAllDay()));
			workExtra.setStartDate(workExtraModel.getStartDate());
			workExtra.setReason(workExtraModel.getReason());
			workExtra.setReallyEndDate("");
			workExtra.setState("1");
			UserInfo userInfo = getCurrentUser();
			workExtra.setUserInfoByApplyUser(userInfo);
			workExtra.setUserInfoByExamineUser(findDeptManager2User(userInfo));
			SimpleDateFormat format = new SimpleDateFormat(
					"yyyy-MM-dd HH:mm:ss");
			workExtra.setApplyDate(format.format(new Date()));
			dao.add(workExtra);
			getResponse().getWriter().write("true");
		} catch (Exception e) {
			e.printStackTrace();
			getResponse().getWriter().write("false");
		}
	}
    public void getTask(){
    	DetachedCriteria queryCriteria=DetachedCriteria.forClass(WorkExtra.class);
    	DetachedCriteria criteriaCount=DetachedCriteria.forClass(WorkExtra.class);
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
		List<WorkExtra> lists = dao.find(queryCriteria, getStart(), getLimit());
		Long count = dao.getCount(criteriaCount, new WorkExtra());
		try {
			getResponse().getWriter().write(
					JsonOperate.getpageJson(count, getListGson4Ower(lists)));
		} catch (IOException e) {
			e.printStackTrace();
		}
    	
    }
    public String getListGson4Ower(List<WorkExtra> list) {
		StringBuffer sb = new StringBuffer();
		sb.append("[");
		for (WorkExtra workExtra : list) {
			sb.append("{");
			sb.append("'id':'" + workExtra.getId() + "',");
			sb.append("'startDate':'" + workExtra.getStartDate() + "',");
			sb.append("'reallyEndDate':'" + workExtra.getReallyEndDate()
					+ "',");
			sb.append("'estimateEndDate':'" + workExtra.getEstimateEndDate()
					+ "',");
			sb.append("'userInfoByApplyUser':'" + workExtra.getUserInfoByApplyUser().getUserName()
							+ "',");
			sb.append("'applyDate':'" + workExtra.getApplyDate() + "',");
			sb.append("'state':'" + workExtra.getState() + "',");
			sb.append("'reason':'" + workExtra.getReason() + "'");
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
		WorkExtra target = dao.get(workExtraModel.getId());
		target.setAllDay(Boolean.parseBoolean(workExtraModel.getIsAllDay()));
		target.setEstimateEndDate(workExtraModel.getEstimateEndDate());
		target.setStartDate(workExtraModel.getStartDate());
		target.setReason(workExtraModel.getReason());
		target.setState("1");
		dao.update(target);
		getResponse().getWriter().write("true");
	}
	public void update() throws Exception {
		WorkExtra target = dao.get(workExtraModel.getId());
		WorkExtra source=new WorkExtra();
		source.setState(workExtraModel.getState());
		BeanUtil.copy(source, target);
		String comment=request.getParameter("workExtraCommentFiled");
		if(workExtraModel.getState().equals("4")){
			SimpleDateFormat format = new SimpleDateFormat(
			"yyyy-MM-dd HH:mm:ss");
			target.setReallyEndDate(format.format(new Date()));
		}
		if(null!=comment&&!"".equals(comment)){
			FlowComments comments=new FlowComments();
			comments.setFlowId(target.getId());
			comments.setFlowType(3);
			comments.setMsg(comment);
			comments.setUserName(getCurrentUser().getUserName());
			commentsDao.add(comments);
		}
		dao.update(target);
		getResponse().getWriter().write("true");
	}
	public void delete() throws Exception{
		WorkExtra extra=new WorkExtra();
		extra.setId(workExtraModel.getId());
		dao.delete(extra);
		getResponse().getWriter().write("true");
	}
}
