package com.wb.core.action;

import java.io.IOException;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

import javax.annotation.Resource;

import org.hibernate.criterion.DetachedCriteria;
import org.hibernate.criterion.MatchMode;
import org.hibernate.criterion.Restrictions;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;
import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import com.opensymphony.xwork2.ActionContext;
import com.soft.core.action.AbstractAction;
import com.soft.core.utils.BeanUtil;
import com.soft.core.utils.JsonOperate;
import com.soft.core.utils.SystemConstant;
import com.wb.core.dao.UserDao;
import com.wb.core.domain.Depart;
import com.wb.core.domain.Desktop;
import com.wb.core.domain.Position;
import com.wb.core.domain.RoleInfo;
import com.wb.core.domain.UserInfo;
import com.wb.core.domain.UserState;
import com.wb.core.utils.UserModel;

@Controller
@Scope("prototype")
public class UserAction extends AbstractAction {

	private static final long serialVersionUID = 1L;
	private UserDao dao;
	private String id;
	private String departName;
	private String position;
	private String roleName;
	private String userState;
	private String userRecord;
	private String userName;
	private String password;
	private String userSex;
	private String userQq;
	private String userTel;
	private String userAddress;
	private String userDes;
	private String userSchool;
	private String userBirth;

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getDepartName() {
		return departName;
	}

	public void setDepartName(String departName) {
		this.departName = departName;
	}

	public String getPosition() {
		return position;
	}

	public void setPosition(String position) {
		this.position = position;
	}

	public String getRoleName() {
		return roleName;
	}

	public void setRoleName(String roleName) {
		this.roleName = roleName;
	}

	public String getUserState() {
		return userState;
	}

	public void setUserState(String userState) {
		this.userState = userState;
	}

	public String getUserRecord() {
		return userRecord;
	}

	public void setUserRecord(String userRecord) {
		this.userRecord = userRecord;
	}

	public String getUserName() {
		return userName;
	}

	public void setUserName(String userName) {
		this.userName = userName;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public String getUserSex() {
		return userSex;
	}

	public void setUserSex(String userSex) {
		this.userSex = userSex;
	}

	public String getUserQq() {
		return userQq;
	}

	public void setUserQq(String userQq) {
		this.userQq = userQq;
	}

	public String getUserTel() {
		return userTel;
	}

	public void setUserTel(String userTel) {
		this.userTel = userTel;
	}

	public String getUserAddress() {
		return userAddress;
	}

	public void setUserAddress(String userAddress) {
		this.userAddress = userAddress;
	}

	public String getUserDes() {
		return userDes;
	}

	public void setUserDes(String userDes) {
		this.userDes = userDes;
	}

	public String getUserSchool() {
		return userSchool;
	}

	public void setUserSchool(String userSchool) {
		this.userSchool = userSchool;
	}

	public String getUserBirth() {
		return userBirth;
	}

	public void setUserBirth(String userBirth) {
		this.userBirth = userBirth;
	}

	@Resource
	public void setDao(UserDao dao) {
		this.dao = dao;
	}

	public void login() throws Exception {
		String id = request.getParameter("id");
		String pass = request.getParameter("password");
		UserInfo user = dao.login(Integer.parseInt(id), pass);
		if (null != user) {
			if (user.getUserState().getId() != 3) {
				String str = "{'success':true,'user':'" + user.getUserName()+"'}";
				ActionContext.getContext().getSession().put(
						SystemConstant.CURRENT_USER, user);
				getResponse().getWriter().write(str);
			} else {
				getResponse().getWriter().write(
						"{'success':false,'msg':'leave'}");
			}
		} else {
			getResponse().getWriter().write("{'success':false,'msg':'error'}");
		}
	}

	public void logout() throws Exception {
		ActionContext.getContext().getSession().clear();
		getResponse().getWriter().write("true");
	}

	public void getUserSession() throws Exception {
		UserInfo user = (UserInfo) ActionContext.getContext().getSession().get(
				SystemConstant.CURRENT_USER);
		if (null != user) {
			getResponse().getWriter().write(user.getUserName());
		} else {
			getResponse().getWriter().write("false");
		}
	}

	public void getAll() {

		String filed1 = request.getParameter("filter[0][field]");
		String filed2 = request.getParameter("filter[1][field]");
		String filed3 = request.getParameter("filter[2][field]");
		String filed4 = request.getParameter("filter[3][field]");
		String filed5 = request.getParameter("filter[4][field]");
		String filed6 = request.getParameter("filter[5][field]");
		String filed7 = request.getParameter("filter[6][field]");
		String filed8 = request.getParameter("filter[7][field]");
		String[] fileds = new String[] { filed1, filed2, filed3, filed4,
				filed5, filed6, filed7, filed8 };
		DetachedCriteria queryCriteria = null;
		queryCriteria = DetachedCriteria.forClass(UserInfo.class);
		DetachedCriteria criteriaCount=DetachedCriteria.forClass(UserInfo.class);
		if (null != getQuery() && !"".equals(getQuery())) {
			queryCriteria.add(Restrictions.like("userName", getQuery(),
					MatchMode.ANYWHERE));
			criteriaCount.add(Restrictions.like("userName", getQuery(),
					MatchMode.ANYWHERE));
		}
		queryCriteria = getQuery(queryCriteria, fileds);
		criteriaCount=getQuery(criteriaCount, fileds);
		try {
			List<UserInfo> lists = dao.find(queryCriteria, getStart(), getLimit());
			Long count = dao.getCount(criteriaCount, new UserInfo());
			getResponse().getWriter().write(
					JsonOperate.getpageJson(count, formatToJson(lists)));
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	private DetachedCriteria getQuery(DetachedCriteria criteria, String[] fileds) {
		String value = "";
		String operate = "";
       
		for (int i = 0; i < fileds.length; i++) {
			if (null != fileds[i] && !"".equals(fileds[i])) {
				if (fileds[i].trim().equals("id")) {
					operate = request.getParameter("filter[" + i
							+ "][data][comparison]");
					value = request.getParameter("filter[" + i
							+ "][data][value]");
					if (operate.trim().equals("lt")) {
						criteria.add(Restrictions.lt("id", new Integer(value)));
					} else if (operate.trim().equals("gt")) {
						criteria.add(Restrictions.gt("id", new Integer(value)));
					} else {
						criteria.add(Restrictions.eq("id", new Integer(value)));
					}	
				} else if (fileds[i].trim().equals("userName")) {
					value = request.getParameter("filter[" + i
							+ "][data][value]");
					criteria.add(Restrictions.like("userName", value,
							MatchMode.ANYWHERE));
				} else if (fileds[i].trim().equals("userSex")) {
					String[] values = request.getParameterValues("filter[" + i
							+ "][data][value]");
					int sex = 0;
					Object[] opts = new Object[values.length];
					for (int j = 0; j < values.length; j++) {
						if (!values[j].trim().equals("男")) {
							sex = 1;
						}
						opts[j] = sex;
					}
					criteria.add(Restrictions.in("userSex", opts));

				} else if (fileds[i].trim().equals("userAge")) {
					operate = request.getParameter("filter[" + i
							+ "][data][comparison]");
					value = request.getParameter("filter[" + i
							+ "][data][value]");
					if (operate.trim().equals("lt")) {
						criteria.add(Restrictions.lt("userAge", new Integer(
								value)));
					} else if (operate.trim().equals("gt")) {
						criteria.add(Restrictions.gt("userAge", new Integer(
								value)));
					} else {
						criteria.add(Restrictions.eq("userAge", new Integer(
								value)));
					}
				} else if (fileds[i].trim().equals("roleName")) {
					String[] values = request.getParameterValues("filter[" + i
							+ "][data][value]");
					List<RoleInfo> list=new ArrayList<RoleInfo>();
					for (int j = 0; j < values.length; j++) {
						RoleInfo e=new RoleInfo();
						e.setId(Integer.parseInt(values[j]));
						list.add(e);
					}
					criteria.add(Restrictions.in("roleInfo", list));
				} else if (fileds[i].trim().equals("userState")) {
					String[] values = request.getParameterValues("filter[" + i
							+ "][data][value]");
					criteria.createAlias("userState", "s");
					Object[] opts = new Object[values.length];
					for (int j = 0; j < values.length; j++) {
						opts[j] = values[j];
					}
					criteria.add(Restrictions.in("s.stateType", opts));
				} else if (fileds[i].trim().equals("departName")) {
					String[] values = request.getParameterValues("filter[" + i
							+ "][data][value]");
					criteria.createAlias("depart", "d");
					Object[] opts = new Object[values.length];
					for (int j = 0; j < values.length; j++) {
						opts[j] = new Integer(values[j]);
					}
					criteria.add(Restrictions.in("d.id", opts));
				}else if (fileds[i].trim().equals("position")) {
					String[] values = request.getParameterValues("filter[" + i
							+ "][data][value]");
					criteria.createAlias("position", "p");
					Object[] opts = new Object[values.length];
					for (int j = 0; j < values.length; j++) {
						opts[j] = new Integer(values[j]);
					}
					criteria.add(Restrictions.in("p.id", opts));
				}
				value = "";
				operate = "";
			}

		}
		return criteria;
	}

	public String formatToJson(List<UserInfo> list) {
		StringBuffer sb = new StringBuffer();
		sb.append("[");
		for (UserInfo userInfo : list) {
			sb.append("{");
			sb.append("'id':'" + userInfo.getId() + "',");
			sb.append("'departName':'" + userInfo.getDepart().getDepartName()
					+ "',");
			sb.append("'position':'" + userInfo.getPosition().getPositionName()
					+ "',");
			sb.append("'roleName':'" + userInfo.getRoleInfo().getRoleName()
					+ "',");
			sb.append("'userState':'" + userInfo.getUserState().getStateType()
					+ "',");
			sb.append("'userRecord':'" + toNull(userInfo.getUserRecord())
					+ "',");
			sb.append("'userName':'" + userInfo.getUserName() + "',");
			sb.append("'password':'" + toNull(userInfo.getPassword()) + "',");
			sb.append("'userSex':'" + toNull(userInfo.getUserSex()) + "',");
			sb.append("'userQq':'" + toNull(userInfo.getUserQq()) + "',");
			sb.append("'userTel':'" + toNull(userInfo.getUserTel()) + "',");
			sb.append("'userAddress':'" + toNull(userInfo.getUserAddress())
					+ "',");
			sb.append("'userDes':'" + toNull(userInfo.getUserDes()) + "',");
			sb.append("'userSchool':'" + toNull(userInfo.getUserSchool())
					+ "',");
			sb.append("'userBirth':'" + toNull(userInfo.getUserBirth()) + "'");
			sb.append("},");
		}
		if (list.size() > 0) {
			sb.deleteCharAt(sb.length() - 1);
		}
		sb.append("]");
		return sb.toString();
	}

	private String toNull(Object object) {
		if (null == object) {
			return "";
		} else {
			return object.toString();
		}
	}

	public void updateJson() {
		String json = request.getParameter("data");
		Gson gson = new Gson();
		try {
			List<UserInfo> list = gson.fromJson(json,
					new TypeToken<List<UserInfo>>() {
					}.getType());
			for (UserInfo UserInfo : list) {
				dao.update(UserInfo);
			}
			getResponse().getWriter().write("true");
		} catch (Exception e) {
			try {
				UserInfo UserInfo = gson.fromJson(json, UserInfo.class);
				dao.update(UserInfo);
			} catch (Exception e2) {
				try {
					getResponse().getWriter().write("false");
				} catch (IOException e1) {
				}
			}
		}
	}

	public void update() {
		try {
			UserInfo userInfo = new UserInfo();
			userInfo = getUserByMy(userInfo);
			userInfo.setId(Integer.parseInt(id));
			dao.update(userInfo);
			getResponse().getWriter().write("{'success':true,'msg':'false'}");
		} catch (Exception e) {
			e.printStackTrace();
			try {
				getResponse().getWriter().write("{'success':false,'msg':'false'}");
			} catch (IOException e1) {
			}
		}
	}

	public void add() {
		try {
			Serializable id = dao.add(getUserByMy(new UserInfo()));
			if (null != password && !"".equals(password)) {
				getResponse().getWriter().write(
						"{'success':true,'msg':" + id + "}");
			} else {
				getResponse().getWriter().write(
						"{'success':true,'msg':'false'}");
			}
		} catch (Exception e) {
			e.printStackTrace();
			try {
				getResponse().getWriter().write("{'success':false}");
			} catch (IOException e1) {
			}
		}
	}

	private UserInfo getUserByMy(UserInfo userInfo) {
		DetachedCriteria criteria = null;
		Position position = null;
		try {
			position = new Position();
			position.setId(Integer.parseInt(getPosition()));
		} catch (Exception e) {
			criteria = DetachedCriteria.forClass(Position.class);
			criteria.add(Restrictions.eq("positionName", getPosition()));
			position = (Position) dao.find(criteria).get(0);
		}
		userInfo.setPosition(position);
		Depart depart = null;
		try {
			depart = new Depart();
			depart.setId(Integer.parseInt(getDepartName()));
		} catch (Exception e) {
			criteria = DetachedCriteria.forClass(Depart.class);
			criteria.add(Restrictions.eq("departName", getDepartName()));
			depart = (Depart) dao.find(criteria).get(0);
		}
		userInfo.setDepart(depart);
		UserState userState = null;
		try {
			userState = new UserState();
			userState.setId(Integer.parseInt(getUserState()));
		} catch (Exception e) {
			criteria = DetachedCriteria.forClass(UserState.class);
			criteria.add(Restrictions.eq("stateType", getUserState()));
			userState = (UserState) dao.find(criteria).get(0);
		}
		userInfo.setUserState(userState);
		RoleInfo roleInfo = null;
		try {
			roleInfo = new RoleInfo();
			roleInfo.setId(Integer.parseInt(getRoleName()));
		} catch (Exception e) {
			criteria = DetachedCriteria.forClass(RoleInfo.class);
			criteria.add(Restrictions.eq("roleName", getRoleName()));
			roleInfo = (RoleInfo) dao.find(criteria).get(0);
		}
		userInfo.setRoleInfo(roleInfo);
		userInfo.setPassword(toNull(password));
		userInfo.setUserAddress(toNull(userAddress));
		if (null != userBirth && !"".equals(userBirth)) {
			userInfo.setUserBirth(toNull(userBirth));
		} else {
			userInfo.setUserBirth(toNull(userBirth));
		}
		userInfo.setUserDes(toNull(userDes));
		userInfo.setUserName(toNull(userName));
		userInfo.setUserQq(toNull(userQq));
		userInfo.setUserRecord(toNull(userRecord));
		userInfo.setUserSchool(toNull(userSchool));
		userInfo.setUserSex(Integer.parseInt(getUserSex()));
		userInfo.setUserTel(toNull(userTel));
		return userInfo;
	}

	public void addJson() {
		String json = request.getParameter("data");
		Gson gson = new Gson();
		try {
			List<UserInfo> list = gson.fromJson(json,
					new TypeToken<List<UserInfo>>() {
					}.getType());
			for (UserInfo UserInfo : list) {
				dao.save(UserInfo);
			}
			getResponse().getWriter().write("true");
		} catch (Exception e) {
			try {
				UserInfo UserInfo = gson.fromJson(json, UserInfo.class);
				dao.save(UserInfo);
			} catch (Exception e2) {
				try {
					getResponse().getWriter().write("false");
				} catch (IOException e1) {
				}
			}
		}
	}

	public void delete() {
		String json = request.getParameter("data");
		Gson gson = new Gson();
		try {
			List<UserModel> list = gson.fromJson(json,
					new TypeToken<List<UserModel>>() {
					}.getType());
			for (UserModel userModel : list) {
				UserInfo userInfo = new UserInfo();
				userInfo.setId(Integer.parseInt(userModel.getId()));
				dao.delete(userInfo);
			}
			getResponse().getWriter().write("true");
		} catch (Exception e) {
			try {
				UserModel userModel = gson.fromJson(json, UserModel.class);
				UserInfo userInfo = new UserInfo();
				userInfo.setId(Integer.parseInt(userModel.getId()));
				dao.delete(userInfo);
			} catch (Exception e2) {
				try {
					getResponse().getWriter().write("false");
				} catch (IOException e1) {
				}
			}
		}
	}
	public  void  currentUser() throws Exception{
		UserInfo user = (UserInfo) ActionContext.getContext().getSession().get(
				SystemConstant.CURRENT_USER);
		List<UserInfo> lists=new ArrayList<UserInfo>();
		UserInfo userInfo=dao.get(user.getId());
		StringBuffer sb=new StringBuffer();
		sb.append("{data:{");
		sb.append("departName:'"+userInfo.getDepart().getDepartName()+"',");
		sb.append("position:'"+userInfo.getPosition().getPositionName()+"',");
		sb.append("roleName:'"+userInfo.getRoleInfo().getRoleName()+"',");
		sb.append("userState:'"+userInfo.getUserState().getStateType()+"'");
		sb.append("}}");
		getResponse().getWriter().write(sb.toString());
	}
	public void updatePwd() throws Exception{
		try {
			UserInfo user = (UserInfo) ActionContext.getContext().getSession().get(
					SystemConstant.CURRENT_USER);
			UserInfo source=new UserInfo();
			source.setPassword(password);
			BeanUtil.copy(source, user);
			dao.update(user);
			getResponse().getWriter().write("{'success':true}");
		} catch (Exception e) {
			getResponse().getWriter().write("{'success':false}");
		}
	}
	public void currentUserPassword() throws Exception{
		UserInfo user = (UserInfo) ActionContext.getContext().getSession().get(
				SystemConstant.CURRENT_USER);
		getResponse().getWriter().write(user.getPassword());
	}
}
