package com.wb.core.action;

import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.annotation.Resource;

import org.hibernate.criterion.DetachedCriteria;
import org.hibernate.criterion.MatchMode;
import org.hibernate.criterion.Order;
import org.hibernate.criterion.Projection;
import org.hibernate.criterion.Projections;
import org.hibernate.criterion.Restrictions;
import org.hibernate.criterion.SimpleExpression;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;

import com.soft.core.action.AbstractAction;
import com.soft.core.dao.BaseDao;
import com.wb.attendance.domain.OutApply;
import com.wb.attendance.domain.WorkExtra;
import com.wb.attendance.domain.WorkoutApply;
import com.wb.core.dao.UserDao;
import com.wb.core.domain.Calender;
import com.wb.core.domain.RoleAndRight;
import com.wb.core.domain.UserInfo;
import com.wb.email.domain.EmailBox;
import com.wb.notice.domain.NoticeInfo;
import com.wb.task.domain.TaskInfo;
import com.wb.vote.domain.VoteItem;
import com.wb.vote.domain.VoteSubject;

@Controller
@Scope("prototype")
public class RemindAction extends AbstractAction {

	private static final long serialVersionUID = 1L;
	private UserDao dao;

	public UserDao getDao() {
		return dao;
	}

	@Resource
	public void setDao(UserDao dao) {
		this.dao = dao;
	}

	public void getRemindAll() throws Exception {
		long workApply = getWorkExtraApply();
		long outApply = getOutApply();
		long workout = getWorkout();
		long applyAll = workApply + outApply + workout; // 个人总数
		long workApplyExam = getWorkExtraApplyExamine();
		long outApplyExam = getOutApplyExamine();
		long workoutExam = getWorkoutExamine();
		long ExamAll = workApplyExam + outApplyExam + workoutExam; // 审批总数
		getResponse().getWriter().write(
				applyAll + "-" + workApply + "-" + outApply + "-" + workout
						+ "-" + ExamAll + "-" + workApplyExam + "-"
						+ outApplyExam + "-" + workoutExam);
	}

	// 得到加班申请提示数量
	private long getWorkExtraApply() {
		DetachedCriteria criteria = DetachedCriteria.forClass(WorkExtra.class);
		List<String> states = new ArrayList<String>();
		states.add("2");
		states.add("3");
		criteria.add(Restrictions.eq("userInfoByApplyUser", getCurrentUser()));
		criteria.add(Restrictions.in("state", states));
		return dao.getCount(criteria, new WorkExtra());
	}

	// 得到出差申请提示数量
	private long getWorkout() {
		DetachedCriteria criteria = DetachedCriteria
				.forClass(WorkoutApply.class);
		List<String> states = new ArrayList<String>();
		states.add("2");
		states.add("3");
		criteria.add(Restrictions.eq("userInfoByApplyUser", getCurrentUser()));
		criteria.add(Restrictions.in("state", states));
		return dao.getCount(criteria, new WorkoutApply());
	}

	// 得到外出申请提示数量
	private long getOutApply() {
		DetachedCriteria criteria = DetachedCriteria.forClass(OutApply.class);
		List<String> states = new ArrayList<String>();
		states.add("2");
		states.add("3");
		criteria.add(Restrictions.eq("userInfoByApplyUser", getCurrentUser()));
		criteria.add(Restrictions.in("state", states));
		return dao.getCount(criteria, new OutApply());
	}

	// 得到加班审批提示数量
	private long getWorkExtraApplyExamine() {
		DetachedCriteria criteria = DetachedCriteria.forClass(WorkExtra.class);
		List<String> states = new ArrayList<String>();
		states.add("1");
		states.add("4");
		criteria
				.add(Restrictions.eq("userInfoByExamineUser", getCurrentUser()));
		criteria.add(Restrictions.in("state", states));
		return dao.getCount(criteria, new WorkExtra());
	}

	// 得到出差审批提示数量
	private long getWorkoutExamine() {
		DetachedCriteria criteria = DetachedCriteria
				.forClass(WorkoutApply.class);
		List<String> states = new ArrayList<String>();
		states.add("1");
		states.add("4");
		criteria
				.add(Restrictions.eq("userInfoByExamineUser", getCurrentUser()));
		criteria.add(Restrictions.in("state", states));
		return dao.getCount(criteria, new WorkoutApply());
	}

	// 得到外出审批提示数量
	private long getOutApplyExamine() {
		DetachedCriteria criteria = DetachedCriteria.forClass(OutApply.class);
		List<String> states = new ArrayList<String>();
		states.add("1");
		states.add("4");
		criteria
				.add(Restrictions.eq("userInfoByExamineUser", getCurrentUser()));
		criteria.add(Restrictions.in("state", states));
		return dao.getCount(criteria, new OutApply());
	}

	public void getQuickRemind() throws Exception {
		UserInfo user = dao.get(getCurrentUser().getId());
		StringBuffer sb = new StringBuffer();
		sb.append("[");
		for (RoleAndRight right : user.getRoleInfo().getRoleAndRights()) {
			if (right.getRoleRight().getRightId().equals(300)) {
				long workApplyExam = getWorkExtraApplyExamine();
				long outApplyExam = getOutApplyExamine();
				long workoutExam = getWorkoutExamine();
				long ExamAll = workApplyExam + outApplyExam + workoutExam; // 审批总数
				sb.append("{text:'考勤管理',count:" + ExamAll + "},");
			}
			if (right.getRoleRight().getRightId().equals(600)) {
				long workApply = getWorkExtraApply();
				long outApply = getOutApply();
				long workout = getWorkout();
				long applyAll = workApply + outApply + workout; // 个人总数
				sb.append("{text:'个人管理',count:" + applyAll + "},");
			}
		}
		sb.append("{text:'未读邮件',count:" + getEmail() + "},");
		sb.append("{text:'新发投票',count:" + getVote() + "}");
		sb.append("]");
		getResponse().getWriter().write(sb.toString());
	}

	private long getEmail() {
		DetachedCriteria criteria = DetachedCriteria.forClass(EmailBox.class);
		criteria.createAlias("emailRelationAccepts", "e");
		criteria.add(Restrictions.eq("e.userInfo", getCurrentUser()));
		criteria.add(Restrictions.eq("e.judge", 3));
		criteria.add(Restrictions.eq("e.isRead", false));
		criteria.add(Restrictions.eq("e.isDelete", false));
		return dao.getCount(criteria, new EmailBox());
	}

	private int getVote() {
		DetachedCriteria criteriaHave = DetachedCriteria
				.forClass(VoteSubject.class);
		criteriaHave.createAlias("voteItems", "v");
		criteriaHave.add(Restrictions.eq("v.userId", getCurrentUser().getId()));
		List<VoteSubject> listHave = dao.find(criteriaHave);
		DetachedCriteria criteriaAll = DetachedCriteria
				.forClass(VoteSubject.class);
		List<VoteSubject> listAll = dao.find(criteriaAll);
		listAll.removeAll(listHave);
		return listAll.size();
	}
}
