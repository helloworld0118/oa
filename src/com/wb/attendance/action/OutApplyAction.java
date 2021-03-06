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
import com.wb.attendance.dao.OutApplyDao;
import com.wb.attendance.domain.OutApply;
import com.wb.attendance.utils.OutApplyModel;
import com.wb.core.domain.UserInfo;

@Controller
@Scope("prototype")
public class OutApplyAction extends AbstractAction {
	/**
	 * 
	 */
	private static final long serialVersionUID = -6923331969975699698L;
	private OutApplyDao dao;
	private FlowCommentsDao commentsDao;
	private OutApplyModel outApplyModel;

	@Resource
	public void setCommentsDao(FlowCommentsDao commentsDao) {
		this.commentsDao = commentsDao;
	}

	@Resource
	public void setDao(OutApplyDao dao) {
		this.dao = dao;
	}

	public OutApplyModel getOutApplyModel() {
		return outApplyModel;
	}

	public void setOutApplyModel(OutApplyModel outApplyModel) {
		this.outApplyModel = outApplyModel;
	}

	public void getAll() {
		DetachedCriteria queryCriteria = null;
		queryCriteria = DetachedCriteria.forClass(OutApply.class);
		queryCriteria.add(Restrictions.eq("userInfoByApplyUser",
				getCurrentUser()));
		queryCriteria.addOrder(Order.desc("id"));
		DetachedCriteria criteriaCount = DetachedCriteria
				.forClass(OutApply.class);
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
		List<OutApply> lists = dao.find(queryCriteria, getStart(), getLimit());
		Long count = dao.getCount(criteriaCount, new OutApply());
		try {
			getResponse().getWriter().write(
					JsonOperate.getpageJson(count, getListGson4me(lists)));
		} catch (IOException e) {
			e.printStackTrace();
		}
	}

	public String getListGson4me(List<OutApply> list) {
		StringBuffer sb = new StringBuffer();
		sb.append("[");
		for (OutApply outApply : list) {
			sb.append("{");
			sb.append("'id':'" + outApply.getId() + "',");
			sb.append("'beginTime':'" + outApply.getStartDate() + "',");
			sb.append("'endTime':'" + outApply.getEndDate() + "',");
			sb.append("'reallyEndDate':'" + outApply.getReallyEndDate()
					+ "',");
			sb.append("'applyDate':'" + outApply.getApplyDate() + "',");
			sb.append("'state':'" + outApply.getState() + "',");
			sb.append("'comments':" + JsonFlowComments(outApply) + ",");
			sb.append("'reason':'" + outApply.getReason() + "'");
			sb.append("},");
		}
		if (list.size() > 0) {
			sb.deleteCharAt(sb.length() - 1);
		}
		sb.append("]");
		return sb.toString();
	}

	private String JsonFlowComments(OutApply model) {
		DetachedCriteria criteria = DetachedCriteria
				.forClass(FlowComments.class);
		criteria.add(Restrictions.eq("flowId", model.getId()));
		criteria.add(Restrictions.eq("flowType", 4));
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
			OutApply outApply = new OutApply();
			outApply.setStartDate(outApplyModel.getStartDate());
			outApply.setReason(outApplyModel.getReason());
			outApply.setEndDate(outApplyModel.getEndDate());
			outApply.setReallyEndDate("");
			outApply.setState("1");
			UserInfo userInfo = getCurrentUser();
			outApply.setUserInfoByApplyUser(userInfo);
			outApply.setUserInfoByExamineUser(findDeptManager2User(userInfo));
			SimpleDateFormat format = new SimpleDateFormat(
					"yyyy-MM-dd HH:mm:ss");
			outApply.setApplyDate(format.format(new Date()));
			dao.add(outApply);
			getResponse().getWriter().write("true");
		} catch (Exception e) {
			e.printStackTrace();
			getResponse().getWriter().write("false");
		}
	}

	public void getTask() {
		DetachedCriteria queryCriteria = DetachedCriteria
				.forClass(OutApply.class);
		DetachedCriteria criteriaCount = DetachedCriteria
				.forClass(OutApply.class);
		queryCriteria.add(Restrictions.eq("userInfoByExamineUser",
				getCurrentUser()));
		criteriaCount.add(Restrictions.eq("userInfoByExamineUser",
				getCurrentUser()));
		queryCriteria.addOrder(Order.desc("id"));
		List<String> states = new ArrayList<String>();
		states.add("1");
		states.add("4");
		states.add("7");
		queryCriteria.add(Restrictions.in("state", states));
		criteriaCount.add(Restrictions.in("state",states));
		if (null != getQuery() && !"".equals(getQuery())) {
			queryCriteria.add(Restrictions.like("userInfoByApplyUser",
					getQuery(), MatchMode.ANYWHERE));
			criteriaCount.add(Restrictions.like("userInfoByApplyUser",
					getQuery(), MatchMode.ANYWHERE));
		}
		List<OutApply> lists = dao.find(queryCriteria, getStart(), getLimit());
		Long count = dao.getCount(criteriaCount, new OutApply());
		try {
			getResponse().getWriter().write(
					JsonOperate.getpageJson(count, getListGson4Ower(lists)));
		} catch (IOException e) {
			e.printStackTrace();
		}

	}

	public String getListGson4Ower(List<OutApply> list) {
		StringBuffer sb = new StringBuffer();
		sb.append("[");
		for (OutApply outApply : list) {
			sb.append("{");
			sb.append("'id':'" + outApply.getId() + "',");
			sb.append("'startDate':'" + outApply.getStartDate() + "',");
			sb.append("'endTime':'" + outApply.getEndDate()
					+ "',");
			sb.append("'reallyEndDate':'" + outApply.getReallyEndDate()
					+ "',");
			sb.append("'userInfoByApplyUser':'"
					+ outApply.getUserInfoByApplyUser().getUserName() + "',");
			sb.append("'applyDate':'" + outApply.getApplyDate() + "',");
			sb.append("'state':'" + outApply.getState() + "',");
			sb.append("'reason':'" + outApply.getReason() + "'");
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

	public void updateAll() throws Exception {
		OutApply target = dao.get(outApplyModel.getId());
		target.setEndDate(outApplyModel.getEndDate());
		target.setStartDate(outApplyModel.getStartDate());
		target.setReason(outApplyModel.getReason());
		target.setState("1");
		dao.update(target);
		getResponse().getWriter().write("true");
	}

	public void update() throws Exception {
		OutApply target = dao.get(outApplyModel.getId());
		OutApply source = new OutApply();
		source.setState(outApplyModel.getState());
		BeanUtil.copy(source, target);
		String comment = request.getParameter("outApplyCommentFiled");
		if(outApplyModel.getState().equals("4")){
			SimpleDateFormat format = new SimpleDateFormat(
			"yyyy-MM-dd HH:mm:ss");
			target.setReallyEndDate(format.format(new Date()));
		}
		if (null != comment && !"".equals(comment)) {
			FlowComments comments = new FlowComments();
			comments.setFlowId(target.getId());
			comments.setFlowType(4);
			comments.setMsg(comment);
			comments.setUserName(getCurrentUser().getUserName());
			commentsDao.add(comments);
		}
		dao.update(target);
		getResponse().getWriter().write("true");
	}

	public void delete() throws Exception {
		OutApply outApply = new OutApply();
		outApply.setId(outApplyModel.getId());
		dao.delete(outApply);
		getResponse().getWriter().write("true");
	}
}
