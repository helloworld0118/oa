package coretest;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

import org.apache.commons.mail.Email;
import org.hibernate.Criteria;
import org.hibernate.SQLQuery;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.Transaction;
import org.hibernate.criterion.DetachedCriteria;
import org.hibernate.criterion.Restrictions;
import org.junit.Test;
import org.springframework.context.support.ClassPathXmlApplicationContext;

import com.google.gson.Gson;
import com.wb.core.dao.UserDao;
import com.wb.core.domain.Depart;
import com.wb.core.domain.UserInfo;
import com.wb.core.utils.UserTreeModel;
import com.wb.email.domain.EmailBox;
import com.wb.email.domain.EmailRelationAccept;
import com.wb.notice.domain.NoticeInfo;
import com.wb.notice.domain.NoticeSeen;
import com.wb.notice.utils.UserNoticeModel;

public class TestUserTreeDao {
	@Test
	public void test12() {
		ClassPathXmlApplicationContext ac = new ClassPathXmlApplicationContext(
				"spring/applicationContext*.xml");
		UserDao dao = ac.getBean(UserDao.class);
		UserNoticeModel root = new UserNoticeModel();
		root.setExpanded(true);
		UserNoticeModel haveSee = new UserNoticeModel();
		haveSee.setText("已阅读");
		haveSee.setExpanded(true);
		root.getChildren().add(haveSee);
		UserNoticeModel noSee = new UserNoticeModel();
		noSee.setText("未阅读");
		noSee.setExpanded(true);
		root.getChildren().add(noSee);
		DetachedCriteria criteriaUser = DetachedCriteria
				.forClass(UserInfo.class);
		List<UserInfo> userlist = dao.find(criteriaUser);
		DetachedCriteria criteriaDepart = DetachedCriteria
				.forClass(Depart.class);
		List<Depart> departlist = dao.find(criteriaDepart);
		DetachedCriteria criteriaNotice = DetachedCriteria
				.forClass(NoticeInfo.class);
		criteriaNotice.add(Restrictions.eq("id", 10));
		List<NoticeInfo> noticelist = dao.find(criteriaNotice);
		for (Depart depart : departlist) {
			UserNoticeModel parent = new UserNoticeModel();
			parent.setText(depart.getDepartName());
			parent.setExpanded(true);
			parent.setIconCls("");
			haveSee.getChildren().add(parent);
			noSee.getChildren().add(parent);
		}
		for (UserInfo userinfo : userlist) {
			for (NoticeInfo noticeInfo : noticelist) {
				for (NoticeSeen seen : noticeInfo.getNoticeSeens()) {
					if (seen.getUser().equals(userinfo.getId())) {
						UserNoticeModel child = new UserNoticeModel();
						child.setExpanded(false);
						child.setIconCls("");
						child.setPosition(userinfo.getPosition()
								.getPositionName());
						child.setText(userinfo.getUserName());
						child.setTime("");
						child.setTime(seen.getTime());
						for (UserNoticeModel subParent : haveSee.getChildren()) {
							if (subParent.getText().equals(
									userinfo.getDepart().getDepartName())) {
								subParent.getChildren().add(child);
							}
						}
					}
				}
			}
		}
		for (UserInfo userinfo : userlist) {
			for (NoticeInfo noticeInfo : noticelist) {
				for (NoticeSeen seen : noticeInfo.getNoticeSeens()) {
					if (!seen.getUser().equals(userinfo.getId())) {
						UserNoticeModel child = new UserNoticeModel();
						child.setExpanded(false);
						child.setIconCls("");
						child.setPosition(userinfo.getPosition()
								.getPositionName());
						child.setText(userinfo.getUserName());
						child.setTime("");
						for (UserNoticeModel subParent : noSee.getChildren()) {
							if (subParent.getText().equals(
									userinfo.getDepart().getDepartName())) {
								subParent.getChildren().add(child);
							}
						}
					}
				}
			}
		}
		Gson gson=new Gson();
		String str=gson.toJson(root);
		System.out.println(str);
	}

	public void test23() {
		String str = "[{\"property\":\"taskID\",\"value\":\"11\"}";
		str = str.substring(0, str.lastIndexOf("\""));
		str = str.substring(str.lastIndexOf("\"") + 1);
		System.out.println(str);
	}

	public void test4() {
		ClassPathXmlApplicationContext ac = new ClassPathXmlApplicationContext(
				"spring/applicationContext*.xml");
		UserDao dao = ac.getBean(UserDao.class);
		DetachedCriteria criteria = DetachedCriteria.forClass(UserInfo.class);
		List<UserInfo> userList = dao.find(criteria);
		DetachedCriteria criteriaDepart = DetachedCriteria
				.forClass(Depart.class);
		List<Depart> departList = dao.find(criteriaDepart);
		UserTreeModel root = new UserTreeModel();
		root.setLeaf(false);
		for (Depart depart : departList) {
			UserTreeModel parent = new UserTreeModel();
			parent.setDepartName(depart.getDepartName());
			parent.setLeaf(false);
			root.getChildren().add(parent);
		}
		for (UserInfo user : userList) {
			UserTreeModel child = new UserTreeModel();
			child.setUserName(user.getUserName());
			for (UserTreeModel node : root.getChildren()) {
				if (node.getDepartName().equals(
						user.getDepart().getDepartName())) {
					node.getChildren().add(child);
				}
			}
		}
		Gson gson = new Gson();
		String str = gson.toJson(root);
		System.out.println(str);
	}
}
