package com.soft.core.dao;

import java.io.Serializable;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.hibernate.Criteria;
import org.hibernate.SessionFactory;
import org.hibernate.criterion.CriteriaSpecification;
import org.hibernate.criterion.DetachedCriteria;
import org.hibernate.criterion.MatchMode;
import org.hibernate.criterion.Projections;
import org.hibernate.criterion.Restrictions;
@SuppressWarnings("unchecked")
public class BaseDao {

	protected SessionFactory sessionFactory;

	@Resource
	public void setSessionFactory(SessionFactory sessionFactory) {
		this.sessionFactory = sessionFactory;
	}

	/**
	 * 添加修改 为方法声明泛型 比如下面的声明public <T> void save(T obj) 表示add方法操作的对象类型是T
	 * T类型到底是什么类型对象，是由方法调用的时候决定 dao.add(Dept) T类型Dept dao.add(User) T类型User
	 * 
	 * @param obj
	 *            添加的对象
	 */
	public <T> void save(T obj) {
		sessionFactory.getCurrentSession().saveOrUpdate(obj);
	}

	/**
	 * 添加方法
	 * 
	 * @param obj
	 */
	public <T> Serializable add(T obj) {
	  Serializable id=	sessionFactory.getCurrentSession().save(obj);
	  return id;
	}

	/**
	 * 修改方法
	 * 
	 * @param obj
	 */
	public <T> void update(T obj) {
		sessionFactory.getCurrentSession().update(obj);
	}

	/**
	 * 删除方法
	 * 
	 * @param obj
	 */
	public <T> void delete(T obj) {
		sessionFactory.getCurrentSession().delete(obj);
	}

	/**
	 * 加载方法
	 * 
	 * @param clz
	 * @param id
	 * @return
	 */
	public <T> T get(Class<T> clz, Serializable id) {
		return (T) sessionFactory.getCurrentSession().get(clz, id);
	}

	/**
	 * 标准查询
	 * 
	 * @param criteria
	 */
	public <T> List<T> find(DetachedCriteria criteria) {
		Criteria c = criteria.getExecutableCriteria(sessionFactory
				.getCurrentSession());
		return c.list();
	}

	public <T> Long getCount(List<String> keys,List<String> values ,T entity) {
		DetachedCriteria criteria=DetachedCriteria.forClass(entity.getClass());
		Criteria c =criteria.setProjection(Projections.rowCount()).getExecutableCriteria(sessionFactory
				.getCurrentSession());
		for (int i=0;i<values.size();i++) {
			c= criteria.add(Restrictions.like(keys.get(i),values.get(i), MatchMode.ANYWHERE))
			.getExecutableCriteria(sessionFactory.getCurrentSession());
		}
		return (Long) c.uniqueResult();
	}
	public <T> Long getCount(DetachedCriteria criteria ,T entity) {
		Criteria c =criteria.getExecutableCriteria(sessionFactory
				.getCurrentSession());
		c.setProjection(Projections.rowCount());
		return (Long) c.uniqueResult();
	}
	/**
	 * 分页查询
	 * 
	 * @param dept
	 *            封装了查询条件的对象
	 * @param start
	 *            起始的下标
	 * @param pageSize
	 *            每页行数
	 * @return pageResult 里面有一页数据，和总行数
	 */
	public <T> List<T> find(DetachedCriteria criteria,int start, int limit) {
		Criteria c = criteria.getExecutableCriteria(sessionFactory
				.getCurrentSession());
		c.setFirstResult(start).setMaxResults(limit);
		return c.list();
	}
}
