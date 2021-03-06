package coretest;
import java.io.IOException;
import java.util.*;

import org.hibernate.SessionFactory;
import org.hibernate.criterion.DetachedCriteria;
import org.junit.Test;
import org.springframework.context.support.ClassPathXmlApplicationContext;

import com.google.gson.Gson;
import com.wb.core.dao.RoleInfoDao;
import com.wb.core.domain.Depart;
import com.wb.core.domain.RoleAndRight;
import com.wb.core.domain.RoleInfo;
import com.wb.core.domain.RoleRight;
import com.wb.core.utils.TreeCheckedModel;

public class TestRoleInfoDao {
	
	public void test() {
		ClassPathXmlApplicationContext ac = new ClassPathXmlApplicationContext(
				"spring/applicationContext*.xml");
		RoleInfoDao dao = ac.getBean(RoleInfoDao.class);
		DetachedCriteria criteria = DetachedCriteria.forClass(RoleInfo.class);
		RoleInfo role = dao.get(1);
		Set<RoleAndRight> rs = role.getRoleAndRights();
		TreeCheckedModel root = new TreeCheckedModel();
		root.setChecked(false);
		root.setId(0);
		root.setLeaf(false);
		root.setText("root");
		for (RoleAndRight roleAndRight : rs) {
			RoleRight roleright = roleAndRight.getRoleRight();
			boolean parent = roleright.getRightId() % 100 == 0 ? true : false;
			TreeCheckedModel node = new TreeCheckedModel();
			node.setChecked(false);
			node.setId(roleright.getRightId());
			node.setQtitle(roleright.getRightUrl());
			node.setIconCls(roleright.getRightIconCls());
			node.setText(roleright.getRightName());
			if (parent) {
				node.setLeaf(false);
				root.getChildren().add(node);
			}
		}
		Collections.sort(root.getChildren());
		
		for (TreeCheckedModel parentNode : root.getChildren()) {
			for (RoleAndRight roleAndRight : rs) {
				RoleRight roleright = roleAndRight.getRoleRight();
				boolean parent = roleright.getRightId() % 100 == 0 ? true
						: false;
				TreeCheckedModel node = new TreeCheckedModel();
				node.setChecked(false);
				node.setId(roleright.getRightId());
				node.setQtitle(roleright.getRightUrl());
				node.setIconCls(roleright.getRightIconCls());
				node.setText(roleright.getRightName().trim());
				if (!parent) {
					node.setLeaf(true);
					String first = ("" + node.getId()).substring(0, 1);
					String parentFirst = ("" + parentNode.getId()).substring(0,
							1);
					if (parentFirst.equals(first)) {
						parentNode.getChildren().add(node);
					}
				}
			}

		}
		Gson gson = new Gson();
		String treeStr = gson.toJson(root);
		System.out.println(treeStr);
	}
	@Test
	public void getAll(){
		ClassPathXmlApplicationContext ac = new ClassPathXmlApplicationContext(
		"spring/applicationContext*.xml");
		RoleInfoDao dao = ac.getBean(RoleInfoDao.class);

		DetachedCriteria criteria = DetachedCriteria.forClass(RoleInfo.class);
		List<RoleInfo> lists = dao.find(criteria, 1,15);
		for (RoleInfo roleInfo : lists) {
			System.out.println(roleInfo.getRoleName());
		}
		Gson gson = new Gson();
		//String roleInfoJson = gson.toJson(lists);
		//Long count = dao.getCount(new RoleInfo());
		try {
			//System.out.println(roleInfoJson);
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
}
