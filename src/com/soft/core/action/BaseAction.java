package com.soft.core.action;

import java.io.Serializable;
import java.lang.reflect.Method;
import java.util.ArrayList;
import java.util.List;

import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;

import org.apache.struts2.ServletActionContext;
import org.hibernate.criterion.DetachedCriteria;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import com.opensymphony.xwork2.ActionContext;
import com.opensymphony.xwork2.ModelDriven;
import com.soft.core.dao.GenericDao;
import com.soft.core.utils.BeanUtil;
import com.soft.core.utils.GenericUtil;
import com.wb.core.domain.Depart;

public abstract class BaseAction<T> extends AbstractAction implements
		ModelDriven<T> {

	public static final String ID_GET_METHOD = "getId";

	protected T model;
	protected Class<T> modelClass;
	
	public BaseAction() {
		this.modelClass = GenericUtil.getSuperGenericClass(this.getClass());
	}
	@Override
	public T getModel() {
		if (null == model) {
			try {
				model = (T) modelClass.newInstance();
			} catch (Exception e) {
			}
		}
		return model;
	}

	/**
	 * 返回正在使用的Dao
	 * 
	 * @return
	 */
	public abstract GenericDao<T> getDao();

	/**
	 * 模板方法：在跳到添加页面执行之前执行
	 */
	public void beforToAdd() {

	}

	/**
	 * 模板方法: 在加载前执行
	 */
	public void beforToUpdate() {

	}

	/**
	 * 模板方法：在加载之后执行
	 * 
	 * @param entity
	 */
	public void afterToUpdate(T entity) {

	}

	/**
	 * 模板方法： 在添加或修改之前执行
	 * 
	 * @param model
	 */
	public void beforeSave(T model) {

	}

	/**
	 * 模板方法 在查询执行之前执行，一般用来组织查询条件 这个方法在子类重写之后，用来在子类组织查询条件
	 * 
	 * @param criteria
	 */
	public void beforFind(DetachedCriteria criteria) {

	}

	/**
	 * 跳到添加页面
	 * 
	 * @return
	 */
	public void toAdd() {
		beforToAdd();
	}

	/**
	 * 加载
	 * 
	 * @return
	 */
	/*public void toUpdate() throws Exception {
		// modelClass Dept,Job ---> getId() ---> Long id值
		// DeptAction extends BaseAction<Dept> ----> modelClass == Dept
		// 得到dept getId()方法
		Method idGetter = BeanUtil.getMethod(modelClass, ID_GET_METHOD);
		// 掉用getId方法得到id
		int id =Integer.parseInt(idGetter.invoke(model).toString());
		beforToUpdate();
		T entity = getDao().get(id);
		afterToUpdate(entity);
		ActionContext.getContext().getValueStack().push(entity);
	}*/

	/**
	 * 增加，修改
	 */
	public void update(T t) throws Exception {
		try{
			 getDao().save(t);
		}catch(Exception e){
			 getDao().add(t);
		}
		
	}
   public void save(T t){
	   getDao().add(t);
   }
	/**
	 * 删除
	 */
	public void delete(T t) {
		getDao().delete(t);
	}

	/**
	 * 标准查询
	 * 
	 * @return
	 */
	public void find() {
		DetachedCriteria criteria = DetachedCriteria.forClass(modelClass);

		beforFind(criteria);
		List<T> list = getDao().find(criteria);
		//ActionContext.getContext().put(LIST, list);
	}


}
