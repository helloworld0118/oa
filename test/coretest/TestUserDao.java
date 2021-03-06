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
import org.hibernate.criterion.Projections;
import org.hibernate.criterion.Restrictions;
import org.junit.Test;
import org.springframework.context.support.ClassPathXmlApplicationContext;

import com.wb.core.dao.UserDao;
import com.wb.core.domain.UserInfo;
import com.wb.email.domain.EmailBox;
import com.wb.email.domain.EmailRelationAccept;
import com.wb.vote.domain.VoteItem;
import com.wb.vote.domain.VoteSubject;

public class TestUserDao {
	@Test
	public void test12() {
		ClassPathXmlApplicationContext ac = new ClassPathXmlApplicationContext(
				"spring/applicationContext*.xml");
		UserDao dao = ac.getBean(UserDao.class);
		DetachedCriteria criteriaHave = DetachedCriteria
				.forClass(VoteSubject.class);
		criteriaHave.createAlias("voteItems", "v");
		criteriaHave.add(Restrictions.eq("v.userId", 100000));
		List<VoteSubject> listHave = dao.find(criteriaHave);
		DetachedCriteria criteriaAll = DetachedCriteria
				.forClass(VoteSubject.class);
		List<VoteSubject> listAll = dao.find(criteriaAll);
		listAll.removeAll(listHave);
		System.out.println(listAll.size());
	}

	public void test4() {
		ClassPathXmlApplicationContext ac = new ClassPathXmlApplicationContext(
				"spring/applicationContext*.xml");
		SessionFactory sessionFactory = ac.getBean(SessionFactory.class);
		Session session = sessionFactory.openSession();
		Transaction transaction = session.beginTransaction();
		EmailBox emailBox = new EmailBox();
		emailBox.setEmailContent("内容");
		emailBox.setEmailDate("1151-12-12");
		emailBox.setEmailTitle("TITLE1");
		EmailRelationAccept accept = new EmailRelationAccept();
		accept.setIsRead(false);
		accept.setIsDelete(false);
		accept.setJudge(0);
		UserInfo userInfo = new UserInfo();
		userInfo.setId(100000);
		accept.setUserInfo(userInfo);
		accept.setEmailBox(emailBox);
		userInfo.setId(100006);
		emailBox.setSendUser(userInfo);
		emailBox.setIsDelete(false);
		emailBox.setJudge(0);
		emailBox.getEmailRelationAccepts().add(accept);
		session.save(emailBox);
		transaction.commit();
		session.close();
	}

	public void test2() {
		ClassPathXmlApplicationContext ac = new ClassPathXmlApplicationContext(
				"spring/applicationContext*.xml");
		SessionFactory sessionFactory = ac.getBean(SessionFactory.class);
		Session session = sessionFactory.openSession();
		DetachedCriteria criteria = DetachedCriteria.forClass(EmailBox.class);
		UserInfo user = new UserInfo();
		user.setId(100006);
		criteria.createAlias("emailRelationSends", "e");
		criteria.add(Restrictions.eq("e.userInfo", user));
		Criteria c = criteria.getExecutableCriteria(session);
		List<EmailBox> list = c.list();
		for (EmailBox emailBox : list) {
			Set<EmailRelationAccept> accpts = emailBox
					.getEmailRelationAccepts();
			for (EmailRelationAccept emailRelationAccept : accpts) {
				System.out.println(emailRelationAccept.getUserInfo().getId());
			}
			// System.out.println(emailBox.getEmailContent());
		}
	}
}
