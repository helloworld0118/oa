package com.soft.process.activiti;

import java.util.List;

import javax.annotation.Resource;

import org.activiti.engine.delegate.DelegateTask;
import org.activiti.engine.delegate.TaskListener;
import org.springframework.stereotype.Component;

import com.soft.core.domain.ActivitiBaseEntity;
import com.soft.core.utils.ProcessVariableEnum;
import com.soft.process.dao.ActivitiDao;
import com.wb.core.domain.UserInfo;

@Component
public class DepartManagerListener implements TaskListener {

	private ActivitiDao activitiDao;

	@Resource
	public void setActivitiDao(ActivitiDao activitiDao) {
		this.activitiDao = activitiDao;
	}

	@Override
	public void notify(DelegateTask task) {
		ActivitiBaseEntity model = (ActivitiBaseEntity) task.getVariable(ProcessVariableEnum.model.toString());
		UserInfo requestUser = model.getUser();
		List<UserInfo> users = activitiDao.findDeptManager2User(requestUser.getId());
		for (UserInfo u : users) {
			task.addCandidateUser(u.getUserName());
		}
	}

}
