package com.wb.vote.action;

import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

import javax.annotation.Resource;

import org.hibernate.criterion.DetachedCriteria;
import org.hibernate.criterion.MatchMode;
import org.hibernate.criterion.Order;
import org.hibernate.criterion.Restrictions;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;

import com.google.gson.Gson;
import com.opensymphony.xwork2.ModelDriven;
import com.soft.core.action.AbstractAction;
import com.soft.core.utils.JsonOperate;
import com.wb.core.domain.UserInfo;
import com.wb.notice.domain.NoticeInfo;
import com.wb.vote.dao.VoteSubjectDao;
import com.wb.vote.domain.VoteItem;
import com.wb.vote.domain.VoteOption;
import com.wb.vote.domain.VoteSubject;
import com.wb.vote.utils.ChartModel;

@Controller
@Scope("prototype")
public class VoteSubjectAction extends AbstractAction implements
		ModelDriven<VoteSubject> {
	private static final long serialVersionUID = 1L;
	private VoteSubjectDao dao;
	private VoteSubject voteSubject = new VoteSubject();

	@Resource
	public void setDao(VoteSubjectDao dao) {
		this.dao = dao;
	}

	public VoteSubjectDao getDao() {
		return dao;
	}

	@Override
	public VoteSubject getModel() {
		return voteSubject;
	}

	public void getVoteIng() throws Exception {
		DetachedCriteria criteria = DetachedCriteria
				.forClass(VoteSubject.class);
		SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		criteria.add(Restrictions.gt("vsEndTime", format.format(new Date())));
		DetachedCriteria criteriaCount = DetachedCriteria
				.forClass(VoteSubject.class);
		criteriaCount.add(Restrictions.gt("vsEndTime", format
				.format(new Date())));
		criteria.addOrder(Order.desc("vsId"));
		List<VoteSubject> list = dao.find(criteria, getStart(), getLimit());
		long count = dao.getCount(criteriaCount, new VoteSubject());
		try {
			getResponse().getWriter().write(
					JsonOperate.getpageJson(count, getJsonFormat(list)));
		} catch (IOException e) {
			e.printStackTrace();
		}
	}

	private String getJsonFormat(List<VoteSubject> list) throws Exception {
		StringBuffer sb = new StringBuffer();
		sb.append("[");
		for (VoteSubject voteSubject : list) {
			sb.append("{");
			sb.append("'vsId':'" + voteSubject.getVsId() + "',");
			sb.append("'vsTitle':'" + voteSubject.getVsTitle() + "',");
			sb.append("'state':'" + getStateByTime(voteSubject) + "',");
			sb.append("'vsUser':'" + voteSubject.getVsUser() + "',");
			sb.append("'vsType':'" + voteSubject.getVsType() + "',");
			sb.append("'vsDes':'" + voteSubject.getVsDes() + "',");
			sb
					.append("'vsCreateTime':'" + voteSubject.getVsCreateTime()
							+ "',");
			sb.append("'vsBeginTime':'" + voteSubject.getVsBeginTime() + "',");
			sb.append("'vsEndTime':'" + voteSubject.getVsEndTime() + "',");
			sb.append("'voteOptions':" + getVoteItems(voteSubject) + ",");
			sb.append("},");
		}
		if (list.size() > 0) {
			sb.deleteCharAt(sb.length() - 1);
		}
		sb.append("]");
		return sb.toString();
	}

	private String getStateByTime(VoteSubject info) throws Exception {
		SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		if (info.getVsIsAllDay()) {
			format = new SimpleDateFormat("yyyy-MM-dd");
		}
		Date start = format.parse(info.getVsBeginTime());
		Date end = format.parse(info.getVsEndTime());
		if (start.getTime() > new Date().getTime()) {
			return "<span style=\"color:#A79C9C\">未开始</span>";
		}else if(end.getTime() < new Date().getTime()){
			return  "已结束";
		} else {
			return "<span style=\"color:green\">进行中</span>";
		}
	}

	private String getVoteItems(VoteSubject subject) {
		StringBuffer sb = new StringBuffer();
		sb.append("[");
		for (VoteOption option : subject.getVoteOptions()) {
			sb.append("{'option':'" + option.getVoOption() + "','id':"
					+ option.getVoId() + "},");
		}
		if (subject.getVoteOptions().size() > 0) {
			sb.deleteCharAt(sb.length() - 1);
		}
		sb.append("]");
		return sb.toString();
	}

	public void getVoteEd() throws Exception {
		DetachedCriteria criteria = DetachedCriteria
				.forClass(VoteSubject.class);
		SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		criteria.add(Restrictions.le("vsEndTime", format.format(new Date())));
		DetachedCriteria criteriaCount = DetachedCriteria
				.forClass(VoteSubject.class);
		criteriaCount.add(Restrictions.le("vsEndTime", format
				.format(new Date())));
		criteria.addOrder(Order.desc("vsId"));
		List<VoteSubject> list = dao.find(criteria, getStart(), getLimit());
		long count = dao.getCount(criteriaCount, new VoteSubject());
		try {
			getResponse().getWriter().write(
					JsonOperate.getpageJson(count, getJsonFormat(list)));
		} catch (IOException e) {
			e.printStackTrace();
		}
	}

	public void getAll() throws Exception {
		DetachedCriteria criteria = DetachedCriteria
				.forClass(VoteSubject.class);
		DetachedCriteria criteriaCount = DetachedCriteria
				.forClass(VoteSubject.class);
		criteria.addOrder(Order.desc("vsId"));
		if (null != query && !"".equals(query)) {
			criteria.add(Restrictions
					.like("vsTitle", query, MatchMode.ANYWHERE));
			criteriaCount.add(Restrictions.like("vsTitle", query,
					MatchMode.ANYWHERE));
		}
		List<VoteSubject> list = dao.find(criteria, getStart(), getLimit());
		long count = dao.getCount(criteriaCount, new VoteSubject());
		try {
			getResponse().getWriter().write(
					JsonOperate.getpageJson(count, getJsonFormat(list)));
		} catch (IOException e) {
			e.printStackTrace();
		}
	}

	public void addSubject() throws Exception {
		String[] options = request.getParameterValues("options");
		for (String str : options) {
			VoteOption option = new VoteOption();
			option.setVoOption(str);
			option.setVoteSubject(voteSubject);
			voteSubject.getVoteOptions().add(option);
		}
		try {
			voteSubject.setVsUser(getCurrentUser().getUserName() + "("
					+ getCurrentUser().getId() + ")");
			SimpleDateFormat format = new SimpleDateFormat(
					"yyyy-MM-dd HH:mm:ss");
			voteSubject.setVsCreateTime(format.format(new Date()));
			dao.add(voteSubject);
			getResponse().getWriter().write("{'success':true,'msg':'ok'}");
		} catch (Exception e) {
			getResponse().getWriter().write("{'success':false,'msg':'no'}");
		}

	}

	public void delete() throws Exception {
		try {
			dao.delete(voteSubject);
			getResponse().getWriter().write("true");
		} catch (Exception e) {
			getResponse().getWriter().write("false");
		}
	}

	public void addItems() throws Exception {
		DetachedCriteria criteria = DetachedCriteria.forClass(VoteItem.class);
		criteria.add(Restrictions.eq("voteSubject", voteSubject));
		criteria.add(Restrictions.eq("userId", getCurrentUser().getId()));
		List<VoteItem> list = dao.find(criteria);
		if (null != list && list.size() == 0) {
			String[] opts = request.getParameterValues("options");
			for (String string : opts) {
				VoteItem voteItem = new VoteItem();
				voteItem.setUserId(getCurrentUser().getId());
				VoteOption option = new VoteOption();
				option.setVoId(Integer.parseInt(string));
				voteItem.setVoteOption(option);
				voteItem.setVoteSubject(voteSubject);
				dao.add(voteItem);
			}
			getResponse().getWriter().write("true");
		} else {
			getResponse().getWriter().write("false");
		}
	}

	public void getCurrentUserRole() throws Exception {
		UserInfo user = getCurrentUser();
		if (!user.getRoleInfo().getRoleName().equals("员工")) {
			getResponse().getWriter().write("true");
		} else {
			getResponse().getWriter().write("false");
		}
	}

	public void getVoteDetail() throws Exception {
		List<ChartModel> list = dao.getVoteCount(voteSubject);
		Gson gson = new Gson();
		getResponse().getWriter().write(gson.toJson(list));
	}
	public void getVoteItemsSize() throws Exception{
	  voteSubject=	dao.get(voteSubject.getVsId());
	  getResponse().getWriter().write(voteSubject.getVoteItems().size()+"");
	}
}
