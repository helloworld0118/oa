package com.wb.core.domain;

import java.util.Set;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import org.hibernate.annotations.GenericGenerator;

import com.google.gson.annotations.Expose;

/**
 * UserInfo entity. @author MyEclipse Persistence Tools
 */
@Entity
@Table(name = "user_info", catalog = "super_oa")
public class UserInfo implements java.io.Serializable {

	// Fields
	@Expose
	private Integer id;
	@Expose
	private Depart depart;
	@Expose
	private RoleInfo roleInfo;
	@Expose
	private Position position;
	@Expose
	private UserState userState;
	@Expose
	private String userRecord;
	@Expose
	private String userName;
	@Expose
	private String password;
	@Expose
	private Integer userSex;
	@Expose
	private String userQq;
	@Expose
	private String userTel;
	@Expose
	private String userAddress;
	@Expose
	private String userDes;
	@Expose
	private String userSchool;
	@Expose
	private String userBirth;

	// Constructors

	/** default constructor */
	public UserInfo() {
	}

	/** full constructor */
	public UserInfo(Depart depart, RoleInfo roleInfo, UserState userState,
			String userRecord, String userName, String password,
			Integer userSex, String userQq, String userTel, String userAddress,
			String userDes, Integer userAge, String userSchool,
			String userBirth, String userIdcard) {
		this.depart = depart;
		this.roleInfo = roleInfo;
		this.userState = userState;
		this.userRecord = userRecord;
		this.userName = userName;
		this.password = password;
		this.userSex = userSex;
		this.userQq = userQq;
		this.userTel = userTel;
		this.userAddress = userAddress;
		this.userDes = userDes;
		this.userSchool = userSchool;
		this.userBirth = userBirth;
	}

	// Property accessors
	@GenericGenerator(name = "generator", strategy = "increment")
	@Id
	@GeneratedValue(generator = "generator")
	@Column(name = "id", unique = true, nullable = false)
	public Integer getId() {
		return this.id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "user_depart_id")
	public Depart getDepart() {
		return this.depart;
	}

	public void setDepart(Depart depart) {
		this.depart = depart;
	}

	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "user_role_id")
	public RoleInfo getRoleInfo() {
		return this.roleInfo;
	}

	public void setRoleInfo(RoleInfo roleInfo) {
		this.roleInfo = roleInfo;
	}

	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "user_state_id")
	public UserState getUserState() {
		return this.userState;
	}

	public void setUserState(UserState userState) {
		this.userState = userState;
	}
	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "user_position")
	public Position getPosition() {
		return position;
	}

	public void setPosition(Position position) {
		this.position = position;
	}
	@Column(name = "user_record")
	public String getUserRecord() {
		return this.userRecord;
	}

	public void setUserRecord(String userRecord) {
		this.userRecord = userRecord;
	}

	@Column(name = "user_name", length = 20)
	public String getUserName() {
		return this.userName;
	}

	public void setUserName(String userName) {
		this.userName = userName;
	}

	@Column(name = "password", length = 20)
	public String getPassword() {
		return this.password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	@Column(name = "user_sex")
	public Integer getUserSex() {
		return this.userSex;
	}

	public void setUserSex(Integer userSex) {
		this.userSex = userSex;
	}

	@Column(name = "user_qq", length = 20)
	public String getUserQq() {
		return this.userQq;
	}

	public void setUserQq(String userQq) {
		this.userQq = userQq;
	}

	@Column(name = "user_tel", length = 20)
	public String getUserTel() {
		return this.userTel;
	}

	public void setUserTel(String userTel) {
		this.userTel = userTel;
	}

	@Column(name = "user_address", length = 100)
	public String getUserAddress() {
		return this.userAddress;
	}

	public void setUserAddress(String userAddress) {
		this.userAddress = userAddress;
	}

	@Column(name = "user_des", length = 200)
	public String getUserDes() {
		return this.userDes;
	}

	public void setUserDes(String userDes) {
		this.userDes = userDes;
	}

	@Column(name = "user_school", length = 50)
	public String getUserSchool() {
		return this.userSchool;
	}

	public void setUserSchool(String userSchool) {
		this.userSchool = userSchool;
	}

	@Column(name = "user_birth", length = 20)
	public String getUserBirth() {
		return this.userBirth;
	}

	public void setUserBirth(String userBirth) {
		this.userBirth = userBirth;
	}

}