package emailtest;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
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

import com.wb.core.domain.UserInfo;
import com.wb.email.domain.EmailBox;
import com.wb.email.domain.EmailRelationAccept;
import com.wb.task.domain.TaskInfo;

public class TestEmailDao {
	@Test
	public void test6() {
		ClassPathXmlApplicationContext ac = new ClassPathXmlApplicationContext(
				"spring/applicationContext*.xml");
		SessionFactory sessionFactory = ac.getBean(SessionFactory.class);
		Session session = sessionFactory.openSession();
		List<TaskInfo> list=session.createCriteria(TaskInfo.class).list();
		
	}

	public void test5() {
		SimpleDateFormat format = new SimpleDateFormat("yyyyMMddHHmmss");
		System.out.println(format.format(new Date()));
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
