package com.wb.notice.action;

import java.io.IOException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Set;

import javax.annotation.Resource;
import javax.persistence.criteria.CriteriaBuilder.In;

import org.hibernate.criterion.DetachedCriteria;
import org.hibernate.criterion.MatchMode;
import org.hibernate.criterion.Order;
import org.hibernate.criterion.Restrictions;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;

import com.google.gson.Gson;
import com.soft.core.action.AbstractAction;
import com.soft.core.utils.JsonOperate;
import com.wb.core.domain.Depart;
import com.wb.core.domain.UserInfo;
import com.wb.notice.dao.NoticeInfoDao;
import com.wb.notice.domain.NoticeInfo;
import com.wb.notice.domain.NoticeSeen;
import com.wb.notice.utils.UserNoticeModel;
import com.wb.share.domain.ShareFile;

@Controller
@Scope("prototype")
public class NoticeInfoAction extends AbstractAction {
	private static final long serialVersionUID = 4846628126576846623L;
	private NoticeInfoDao dao;
	private NoticeInfo noticeInfo;

	public NoticeInfoDao getDao() {
		return dao;
	}

	@Resource
	public void setDao(NoticeInfoDao dao) {
		this.dao = dao;
	}

	public NoticeInfo getNoticeInfo() {
		return noticeInfo;
	}

	public void setNoticeInfo(NoticeInfo noticeInfo) {
		this.noticeInfo = noticeInfo;
	}

	public void getAll() throws Exception {
		UserInfo user = getCurrentUser();
		DetachedCriteria criteria = DetachedCriteria.forClass(NoticeInfo.class);
		criteria.add(Restrictions.eq("user", user.getUserName() + "("
				+ user.getId() + ")"));
		DetachedCriteria criteriaCount = DetachedCriteria
				.forClass(NoticeInfo.class);
		criteriaCount.add(Restrictions.eq("user", user.getUserName() + "("
				+ user.getId() + ")"));
		if (null != query && !"".equals(query)) {
			criteria.add(Restrictions.like("title", query, MatchMode.ANYWHERE));
			criteriaCount.add(Restrictions.like("title", query,
					MatchMode.ANYWHERE));
		}
		criteria.addOrder(Order.desc("id"));
		List<NoticeInfo> list = dao.find(criteria, getStart(), getLimit());
		long count = dao.getCount(criteriaCount, new NoticeInfo());
		getResponse().getWriter().write(
				JsonOperate.getpageJson(count, formatToJson(list, false)));

	}

	private String formatToJson(List<NoticeInfo> list, boolean show)
			throws Exception {
		StringBuffer sb = new StringBuffer();
		sb.append("[");
		for (NoticeInfo noticeInfo : list) {
			sb.append("{");
			sb.append("'id':" + noticeInfo.getId() + ",");
			sb.append("'title':'<span style=\"color:#" + noticeInfo.getColor()
					+ "\">" + noticeInfo.getTitle() + "</span>',");
			sb.append("'arrangTime':'" + noticeInfo.getArrangTime() + "',");
			sb.append("'beginTime':'" + noticeInfo.getBeginTime() + "',");
			sb.append("'endTime':'" + noticeInfo.getEndTime() + "',");
			sb.append("'user':'" + noticeInfo.getUser() + "',");
			sb.append("'isAllDay':" + noticeInfo.getIsAllDay() + ",");
			sb.append("'state':'" + getStateByTime(noticeInfo) + "',");
			if (show) {
				sb.append("'haveSee':" + isHaveSee(noticeInfo) + ",");
			}
			sb.append("'color':'" + noticeInfo.getColor() + "',");
			sb.append("'detail':'" + noticeInfo.getDetail() + "'");
			sb.append("},");
		}
		if (list.size() > 0) {
			sb.deleteCharAt(sb.length() - 1);
		}
		sb.append("]");
		return sb.toString();
	}

	private boolean isHaveSee(NoticeInfo noticeInfo) {
		Set<NoticeSeen> set = noticeInfo.getNoticeSeens();
		for (NoticeSeen noticeSeen : set) {
			if (noticeSeen.getUser().equals(getCurrentUser().getId())) {
				return true;
			}
		}
		return false;
	}

	private String getStateByTime(NoticeInfo info) throws Exception {
		SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		if (info.getIsAllDay()) {
			format = new SimpleDateFormat("yyyy-MM-dd");
		}
		Date start = format.parse(info.getBeginTime());
		Date end = format.parse(info.getEndTime());
		if (start.getTime()>new Date().getTime()) {
			return "<span style=\"color:#A79C9C\">未开始</span>";
		} else if (end.getTime() < new Date().getTime()) {
			return "<span style=\"color:red\">已失效</span>";
		} else {
			return "<span style=\"color:green\">进行中</span>";
		}
	}

	public void getShow() throws Exception {
		DetachedCriteria criteria = DetachedCriteria.forClass(NoticeInfo.class);
		DetachedCriteria criteriaCount = DetachedCriteria
				.forClass(NoticeInfo.class);
		criteria.addOrder(Order.desc("id"));
		List<NoticeInfo> list = dao.find(criteria, getStart(), getLimit());
		long count = dao.getCount(criteriaCount, new NoticeInfo());
		getResponse().getWriter().write(
				JsonOperate.getpageJson(count, formatToJson(list, true)));

	}

	public void delete() {
		dao.delete(noticeInfo);
	}

	public void add() throws Exception {
		SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		String time = format.format(new Date());
		noticeInfo.setArrangTime(time);
		noticeInfo.setUser(getCurrentUser().getUserName() + "("
				+ getCurrentUser().getId() + ")");
		dao.add(noticeInfo);
		NoticeSeen seen = new NoticeSeen();
		seen.setNoticeInfo(noticeInfo);
		seen.setTime(time);
		seen.setUser(getCurrentUser().getId());
		dao.save(seen);
		getResponse().getWriter().write("{success:true}");
	}

	public void update() {
		DetachedCriteria criteria = DetachedCriteria.forClass(NoticeInfo.class);
		criteria.add(Restrictions.eq("id", noticeInfo.getId()));
		criteria.createAlias("noticeSeens", "n");
		criteria.add(Restrictions.eq("user", getCurrentUser().getId()
				.toString()));
		List<NoticeInfo> list = dao.find(criteria);
		SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		if (null == list || list.size() == 0) {
			NoticeSeen seen = new NoticeSeen();
			seen.setNoticeInfo(noticeInfo);
			seen.setTime(format.format(new Date()));
			seen.setUser(getCurrentUser().getId());
			dao.add(seen);
		}
	}

	public void getNoticeReaded() throws Exception {
		DetachedCriteria criteriaUser = DetachedCriteria
				.forClass(UserInfo.class);
		List<UserInfo> userlist = dao.find(criteriaUser);
		getResponse().getWriter().write(JsonOperate.getpageJson(Long.parseLong(userlist.size()+""), format2haveread(userlist)));
	}

	private String format2haveread(List<UserInfo> list) {
		StringBuffer sb = new StringBuffer();
		sb.append("[");
		for (UserInfo user : list) {
			String[] str = getInfoBynoticeInfo(user);
			sb.append("{");
			sb.append("'id':" + user.getId() + ",");
			sb.append("'name':'" + str[0] + "',");
			sb.append("'depart':'" + user.getDepart().getDepartName() + "',");
			sb.append("'position':'" + user.getPosition().getPositionName()
					+ "',");
			sb.append("'time':'" + str[1] + "'");
			sb.append("},");
		}
		if (list.size() > 0) {
			sb.deleteCharAt(sb.length() - 1);
		}
		sb.append("]");
		return sb.toString();
	}

	private String[] getInfoBynoticeInfo(UserInfo user) {
		String[] str = new String[2];
		DetachedCriteria criteriaNotice = DetachedCriteria
				.forClass(NoticeInfo.class);
		criteriaNotice.add(Restrictions.eq("id", noticeInfo.getId()));
		NoticeInfo noticeInfo = (NoticeInfo) dao.find(criteriaNotice).get(0);
		boolean have = false;
		for (NoticeSeen seen : noticeInfo.getNoticeSeens()) {
			if (user.getId().equals(seen.getUser())) {
				have = true;
				str[0] = "<span style=\"color:#0B48F7\">" + user.getUserName()
						+ "</span>";
				str[1] = seen.getTime();
				break;
			}
		}
		if (!have) {
			str[0] = "<span style=\"color:#CCCCCC\">" + user.getUserName()
					+ "</span>";
			str[1] = "";
		}
		return str;
	}
}
