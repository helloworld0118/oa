package com.wb.attendance.utils;
import java.io.FileOutputStream;
import java.io.OutputStream;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import org.apache.poi.xssf.streaming.SXSSFWorkbook;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.ss.util.CellRangeAddress;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.hssf.util.Region;
import org.springframework.stereotype.Repository;

import com.wb.core.domain.Depart;

@Repository
public class ExportExcel {
	public void exportExc(List<WorkCensusModel> lists,String path,String startTime,String endTime,Depart depart) {
		Workbook wb;
		wb = new HSSFWorkbook();
		Sheet sheet =null;
		if(null==depart){
			sheet= wb.createSheet(startTime+"-->"+endTime);
		}else{
			sheet= wb.createSheet(startTime+"-->"+endTime+"("+depart.getDepartName()+")");
		}
		Row rowTitle = sheet.createRow(0);
		rowTitle.setHeightInPoints(30);
		System.out.println(sheet.addMergedRegion(CellRangeAddress.valueOf("A1:F1")));
		System.out.println(sheet.addMergedRegion(CellRangeAddress.valueOf("A1:F1")));
		Cell title = rowTitle.createCell(0);
		Cell title1 = rowTitle.createCell(1);
		Cell title2= rowTitle.createCell(2);
		Cell title3 = rowTitle.createCell(3);
		Cell title4 = rowTitle.createCell(4);
		Cell title5 = rowTitle.createCell(5);
		title1.setCellStyle(setboder(wb));
		title2.setCellStyle(setboder(wb));
		title3.setCellStyle(setboder(wb));
		title4.setCellStyle(setboder(wb));
		title5.setCellStyle(setboder(wb));
		SimpleDateFormat format=new SimpleDateFormat("yyyy-MM-dd");
		if (null==depart) {
			title.setCellValue("考勤统计-->"+format.format(new Date()));
		}else{
			title.setCellValue("考勤统计-->"+format.format(new Date()));
		}
		title.setCellStyle(setTitleStyle(wb));
		sheet.setColumnWidth(0, 12*256); 
		sheet.setColumnWidth(1, 12*256); 
		sheet.setColumnWidth(2, 14*256);
		sheet.setColumnWidth(3, 14*256);
		sheet.setColumnWidth(4, 14*256);
		sheet.setColumnWidth(5, 14*256);
		sheet.setColumnWidth(6, 14*256);
		Row rowHead = sheet.createRow(1);
		rowHead.setHeightInPoints(20);
		for (int j = 0; j < head.length; j++) {
			Cell cell = rowHead.createCell(j);
			cell.setCellValue(head[j]);
			cell.setCellStyle(setHeadStyle(wb));
		}
		for (int i = 0; i < lists.size(); i++) {
			Row row = sheet.createRow(i + 2);
			for (int j = 0; j < head.length; j++) {
				Cell cell = row.createCell(j);
				if (j == 0) {
					cell.setCellValue(lists.get(i).getDepartName());
					cell.setCellStyle(setboder(wb));
				} else if (j == 1) {
					cell.setCellValue(lists.get(i).getUserName());
					cell.setCellStyle(setboder(wb));
				} else if (j == 2){
					cell.setCellValue(lists.get(i).getLeaveCount());
					cell.setCellStyle(setboder(wb));
				} else if (j == 3){
					cell.setCellValue(lists.get(i).getOutCount());
					cell.setCellStyle(setboder(wb));
				} else if (j == 4){
					cell.setCellValue(lists.get(i).getWorkoutCount());
					cell.setCellStyle(setboder(wb));
				}else if (j == 5){
					cell.setCellValue(lists.get(i).getWorkExtraCount());
					cell.setCellStyle(setboder(wb));
				}
			}
		}
		try {
			String file =path+"考勤统计.xls";
			if (wb instanceof SXSSFWorkbook)
				file += "x";
			FileOutputStream out = new FileOutputStream(file);
			wb.write(out);
			out.close();
		} catch (Exception e) { // TODO Auto-generated catch block
			e.printStackTrace();
		}

	}

	public static CellStyle setCellFormat(CreationHelper helper,
			CellStyle cellStyle, String fmt) {
		cellStyle.setDataFormat(helper.createDataFormat().getFormat(fmt));
		return cellStyle;
	}

	private static CellStyle setTitleStyle(Workbook wb) {
		CellStyle cellStyle = setboder(wb);
		cellStyle.setFont(setTitleFont(wb));
		return cellStyle;
	}

	private static CellStyle setboder(Workbook wb) {
		CellStyle cellStyle = wb.createCellStyle();
		cellStyle.setBorderBottom(CellStyle.BORDER_THIN);
		cellStyle.setBorderLeft(CellStyle.BORDER_THIN);
		cellStyle.setBorderRight(CellStyle.BORDER_THIN);
		cellStyle.setBorderTop(CellStyle.BORDER_THIN);
		cellStyle.setAlignment(CellStyle.ALIGN_CENTER);
		cellStyle.setVerticalAlignment(CellStyle.VERTICAL_CENTER);
		return cellStyle;
	}

	private static String[] head = new String[] { "部门", "姓名", "请假(次)", "外出(次)", "出差(次)", "加班(次)" };

	private static CellStyle setHeadStyle(Workbook wb) {
		CellStyle cellStyle = setboder(wb);
		cellStyle.setFont(setHeadFont(wb));
		return cellStyle;
	}

	private static Font setTitleFont(Workbook wb) {
		Font font = wb.createFont();
		font.setFontName("宋体");
		font.setBoldweight(Font.BOLDWEIGHT_BOLD);
		font.setFontHeight((short) 500);
		return font;
	}

	private static Font setHeadFont(Workbook wb) {
		Font font = wb.createFont();
		font.setFontName("宋体");
		font.setBoldweight(Font.BOLDWEIGHT_BOLD);
		font.setFontHeight((short) 300);
		return font;
	}
}
