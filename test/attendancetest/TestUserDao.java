package attendancetest;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;

import org.hibernate.Criteria;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.criterion.DetachedCriteria;
import org.hibernate.criterion.Restrictions;
import org.junit.Test;
import org.springframework.context.support.ClassPathXmlApplicationContext;

import com.wb.attendance.dao.WorkoutDao;
import com.wb.attendance.domain.WorkExtra;
import com.wb.attendance.domain.WorkoutApply;
import com.wb.attendance.utils.WorkCensusModel;
import com.wb.core.domain.UserInfo;

public class TestUserDao {
	@Test
	public void testRand(){
		Random random=new Random();
		System.out.println(random.nextInt(1000000));
	}
	@SuppressWarnings("unchecked")
	public void test5() throws Exception {
		ClassPathXmlApplicationContext ac = new ClassPathXmlApplicationContext(
				"spring/applicationContext*.xml");
		SessionFactory sessionFactory = ac.getBean(SessionFactory.class);
		Session session = sessionFactory.openSession();
		List<Object[]> workout_list = session
				.createSQLQuery(
						"SELECT apply_user,COUNT(*) FROM workout_apply  GROUP BY apply_user")
				.list();
		List<Object[]> out_apply_list = session
				.createSQLQuery(
						"SELECT apply_user,COUNT(*) FROM out_apply  GROUP BY apply_user")
				.list();
		List<Object[]> work_extra_list = session
				.createSQLQuery(
						"SELECT apply_user,COUNT(*) FROM work_extra  GROUP BY apply_user")
				.list();
		Map<Integer, Integer> workout_Count = new HashMap<Integer, Integer>();
		Map<Integer, Integer> out_apply_Count = new HashMap<Integer, Integer>();
		Map<Integer, Integer> work_extra_Count = new HashMap<Integer, Integer>();
		for (Object[] objects : workout_list) {
			workout_Count.put(Integer.parseInt(objects[0].toString()), Integer
					.parseInt(objects[1].toString()));
		}
		for (Object[] objects : out_apply_list) {
			out_apply_Count.put(Integer.parseInt(objects[0].toString()),
					Integer.parseInt(objects[1].toString()));
		}
		for (Object[] objects : work_extra_list) {
			work_extra_Count.put(Integer.parseInt(objects[0].toString()),
					Integer.parseInt(objects[1].toString()));
		}
		Map<Integer, Long> work_extra_time = new HashMap<Integer, Long>();
		DetachedCriteria criteriaTime = DetachedCriteria
				.forClass(WorkExtra.class);
		SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd");
		criteriaTime.add(Restrictions.lt("applyDate","2012-09-13"));
		criteriaTime.add(Restrictions.gt("applyDate","2012-09-09"));
		Criteria c = criteriaTime.getExecutableCriteria(sessionFactory
				.openSession());
		List<WorkExtra> workList = c.list();
		System.out.println(workList.size()+"===================size");
		for (WorkExtra workExtra : workList) {
			if (workExtra.isAllDay()) {
				format = new SimpleDateFormat("yyyy-MM-dd");
			}
			Date start = format.parse(workExtra.getStartDate());
			Date end = format.parse(workExtra.getEstimateEndDate());
			long time = (end.getTime() - start.getTime()) / 1000 / 60 / 60;
			if (work_extra_time.containsKey(workExtra.getUserInfoByApplyUser()
					.getId())) {
				long temp = work_extra_time.get(workExtra
						.getUserInfoByApplyUser().getId());
				temp += time;
				work_extra_time.remove(workExtra.getUserInfoByApplyUser()
						.getId());
				work_extra_time.put(workExtra.getUserInfoByApplyUser().getId(),
						temp);
			} else {
				work_extra_time.put(workExtra.getUserInfoByApplyUser().getId(),
						time);
			}
		}
		DetachedCriteria criteria = DetachedCriteria.forClass(UserInfo.class);
		c = criteria.getExecutableCriteria(sessionFactory.openSession());
		List<UserInfo> userList = c.list();
		List<WorkCensusModel> attModels = new ArrayList<WorkCensusModel>();
		for (UserInfo userInfo : userList) {
			WorkCensusModel model = new WorkCensusModel();
			model.setId(userInfo.getId());
			model.setUserName(userInfo.getUserName());
			model.setDepartName(userInfo.getDepart().getDepartName());
			if (workout_Count.containsKey(model.getId())) {
				// TODO
			}
			if (out_apply_Count.containsKey(model.getId())) {
				model.setOutCount(out_apply_Count.get(model.getId()));
			}
			if (work_extra_Count.containsKey(model.getId())) {
			}
			attModels.add(model);
		}
		System.out.println(true);
	}
	
	public void test4() {
		Map<Integer, Long> work_extra_time = new HashMap<Integer, Long>();
		work_extra_time.put(10000, 20l);
		System.out.println(work_extra_time.get(10000) + "==================1");
		Long time = work_extra_time.get(10000);
		work_extra_time.remove(10000);
		time += 20l;
		work_extra_time.put(10000, time);
		System.out.println(work_extra_time.get(10000) + "==================2");
		/*
		 * ClassPathXmlApplicationContext ac = new
		 * ClassPathXmlApplicationContext( "spring/applicationContext*.xml");
		 * SessionFactory sessionFactory = ac.getBean(SessionFactory.class);
		 * Session session = sessionFactory.openSession(); List<Object[]>
		 * workout_list = session .createSQLQuery(
		 * "SELECT apply_user,COUNT(*) FROM workout_apply  GROUP BY apply_user")
		 * .list(); List<Object[]> out_apply_list = session .createSQLQuery(
		 * "SELECT apply_user,COUNT(*) FROM out_apply  GROUP BY apply_user")
		 * .list(); List<Object[]> work_extra_list = session .createSQLQuery(
		 * "SELECT apply_user,COUNT(*) FROM work_extra  GROUP BY apply_user")
		 * .list(); Map<Integer, Integer> workout_Count = new HashMap<Integer,
		 * Integer>(); Map<Integer, Integer> out_apply_Count = new
		 * HashMap<Integer, Integer>(); Map<Integer, Integer> work_extra_Count =
		 * new HashMap<Integer, Integer>(); for (Object[] objects :
		 * workout_list) {
		 * workout_Count.put(Integer.parseInt(objects[0].toString()), Integer
		 * .parseInt(objects[1].toString())); } for (Object[] objects :
		 * out_apply_list) {
		 * out_apply_Count.put(Integer.parseInt(objects[0].toString()), Integer
		 * .parseInt(objects[1].toString())); } for (Object[] objects :
		 * work_extra_list) {
		 * work_extra_Count.put(Integer.parseInt(objects[0].toString()), Integer
		 * .parseInt(objects[1].toString())); }
		 */
	}
}
