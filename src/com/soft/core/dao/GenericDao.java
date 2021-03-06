package com.soft.core.dao;

import java.io.Serializable;
import java.lang.reflect.ParameterizedType;
import java.lang.reflect.Type;

import com.soft.core.utils.GenericUtil;


/**
 * 为类声明泛型：
 * 		GenericDao<T>语法是为类声明类型，表示当前这个类操作E这个类型，
 *  	E这个类型具体是什么由子类在继承的时候决定
 *  	比如:DeptDao extends GenericDao<Dept> E是Dept类型
 * @param <T>
 */
@SuppressWarnings("unchecked")
public class GenericDao<T> extends BaseDao {
	
	private Class<T> entityClass;
	
	public GenericDao() {
		this.entityClass = GenericUtil.getSuperGenericClass(this.getClass());
	}
	
	public T get(Serializable id) {
		return (T) super.sessionFactory.getCurrentSession().get(this.entityClass, id);
	}

}
