package com.wb.core.dao;

import java.util.List;

import org.hibernate.Criteria;
import org.hibernate.criterion.DetachedCriteria;
import org.hibernate.criterion.MatchMode;
import org.hibernate.criterion.Projections;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.soft.core.dao.GenericDao;
import com.wb.core.domain.Depart;
import com.wb.core.domain.RoleInfo;
@Repository
public class RoleInfoDao  extends GenericDao<RoleInfo> {
}
