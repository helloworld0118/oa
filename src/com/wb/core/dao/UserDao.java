package com.wb.core.dao;

import org.hibernate.Criteria;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.soft.core.dao.GenericDao;
import com.wb.core.domain.UserInfo;

@Repository
public class UserDao extends GenericDao<UserInfo>{
	public UserInfo login(int userId, String password) {
		Criteria criteria = sessionFactory.getCurrentSession().createCriteria(UserInfo.class);
		criteria.add(Restrictions.eq("id", userId));
		criteria.add(Restrictions.eq("password", password));
		UserInfo user = (UserInfo) criteria.uniqueResult();
		return user;
	}
}
