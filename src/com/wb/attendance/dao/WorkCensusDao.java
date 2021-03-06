package com.wb.attendance.dao;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.hibernate.criterion.DetachedCriteria;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.soft.core.dao.BaseDao;
import com.wb.attendance.domain.WorkExtra;
import com.wb.attendance.utils.WorkCensusModel;
import com.wb.core.domain.UserInfo;

@Repository
public class WorkCensusDao extends BaseDao {
	@SuppressWarnings("unchecked")
	public List<WorkCensusModel> getList(String startTime, String endTime,DetachedCriteria criteria,int startQuery,int limit)
			throws Exception {
		List<Object[]> workout_list = sessionFactory.getCurrentSession()
				.createSQLQuery(
						"SELECT apply_user,COUNT(*) FROM workout_apply  WHERE start_date>='"
								+ startTime + "' AND start_date<='" + endTime
								+ "' AND state NOT IN(1,3) GROUP BY apply_user")
				.list();
		List<Object[]> out_apply_list = sessionFactory.getCurrentSession()
				.createSQLQuery(
						"SELECT apply_user,COUNT(*) FROM out_apply  WHERE apply_date>='"
								+ startTime + "' AND apply_date<='" + endTime
								+ "' AND state NOT IN(1,3) GROUP BY apply_user")
				.list();
		List<Object[]> work_extra_list = sessionFactory.getCurrentSession()
				.createSQLQuery(
						"SELECT apply_user,COUNT(*) FROM work_extra  WHERE start_date>='"
								+ startTime + "' AND start_date<='" + endTime
								+ "' AND state NOT IN(1,3) GROUP BY apply_user")
				.list();
		List<Object[]> leave_list = sessionFactory.getCurrentSession()
		.createSQLQuery(
				"SELECT user_id, COUNT(*) FROM leave_flow WHERE begin_time>='"+startTime+"' AND begin_time<='"+endTime+"' and state='3' GROUP BY user_id")
		.list();
		
		
		SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		Map<Integer, Integer> workout_Count = new HashMap<Integer, Integer>();
		Map<Integer, Integer> out_apply_Count = new HashMap<Integer, Integer>();
		Map<Integer, Integer> work_extra_Count = new HashMap<Integer, Integer>();
		Map<Integer, Integer> leave_Count = new HashMap<Integer, Integer>();
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
		for (Object[] objects : leave_list) {
			leave_Count.put(Integer.parseInt(objects[0].toString()),
					Integer.parseInt(objects[1].toString()));
		}
		/*Map<Integer, Long> work_extra_time = new HashMap<Integer, Long>();
		DetachedCriteria criteriaTime = DetachedCriteria
				.forClass(WorkExtra.class);
		List<WorkExtra> workList = super.find(criteriaTime);
		for (WorkExtra workExtra : workList) {
			if (workExtra.isAllDay()) {
				format = new SimpleDateFormat("yyyy-MM-dd");
			}
			Date start = format.parse(workExtra.getStartDate());
			Date end = format.parse(workExtra.getReallyEndDate());
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
		}*/
		List<UserInfo> userList = super.find(criteria,startQuery,limit);
		List<WorkCensusModel> attModels = new ArrayList<WorkCensusModel>();
		for (UserInfo userInfo : userList) {
			WorkCensusModel model = new WorkCensusModel();
			model.setId(userInfo.getId());
			model.setUserName(userInfo.getUserName());
			model.setDepartName(userInfo.getDepart().getDepartName());
			if (workout_Count.containsKey(model.getId())) {
				model.setWorkoutCount(workout_Count.get(model.getId()));
			}
			if (out_apply_Count.containsKey(model.getId())) {
				model.setOutCount(out_apply_Count.get(model.getId()));
			}
			if (work_extra_Count.containsKey(model.getId())) {
				model.setWorkExtraCount(work_extra_Count.get(model.getId())+"");
			}
			if (leave_Count.containsKey(model.getId())) {
				model.setLeaveCount(leave_Count.get(model.getId()));
			}
			attModels.add(model);
		}

		return attModels;
	}
}
