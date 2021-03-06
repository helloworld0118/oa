/*
 * This calendar application was forked from Ext Calendar Pro and contributed to
 * Ext JS as an advanced example of what can be built using and customizing Ext
 * components and templates.
 * 
 * If you find this example to be useful you should take a look at the original
 * project, which has more features, more examples and is maintained on a
 * regular basis:
 * 
 * http://ext.ensible.com/products/calendar
 */
var eventStore;
Ext.define('Ext.calendar.App', {
	requires : ['Ext.Viewport', 'Ext.layout.container.Border',
			'Ext.picker.Date', 'Ext.calendar.util.Date',
			'Ext.calendar.CalendarPanel',
			'Ext.calendar.data.MemoryCalendarStore',
			'Ext.calendar.data.MemoryEventStore', 'Ext.calendar.data.Events',
			'Ext.calendar.data.Calendars', 'Ext.calendar.form.EventWindow'],
	constructor : function() {
		this.checkScrollOffset();
		this.calendarStore = Ext.create(
				'Ext.calendar.data.MemoryCalendarStore', {
					data : Ext.calendar.data.Calendars.getData()
				});
		/*
		 * this.eventStore = Ext.create('Ext.calendar.data.MemoryEventStore', {
		 * data: Ext.calendar.data.Events.getData() });
		 */
		eventStore = Ext.create('Ext.calendar.data.MemoryEventStore', {
					model : 'Ext.calendar.data.EventModel',
					proxy : {
						type : 'ajax',
						api : {
							create : '../../../../security/calender!add',
							read : '../../../../security/calender!read',
							update : '../../../../security/calender!update',
							destroy : '../../../../security/calender!delete'
						},
						actionMethods : {
							create : 'POST',
							read : 'POST',
							update : 'POST',
							destroy : 'POST'
						},
						reader : {
							root : 'evts'
						},
						writer : {
							root : 'evts',
							encode : true
						}
					}
				});

		// this.eventStore.load();
		var task = {
			run : function() {
				Ext.Array.each(eventStore.data.items, function(item) {
					if (item.data.Reminder && !item.data.IsReminder) {
							var now = new Date(new Date());
							var min = new Date(item.data.StartDate
									- item.data.Reminder*1000*60);
						if (now > min) {
							var da = (now - min) / 1000;
							if (da < 30) {
								Ext.Msg.alert("提醒", "*<span style='color:red'>"
												+ item.data.Title
												+ "</span>*提醒时间到了！",
										function() {
											item.data.IsReminder = true, Ext.Ajax
													.request({
														url : "../../../../security/calender!update",
														params : {
															data : Ext.JSON
																	.encode(item.data)
														},
														method : "POST",
														success : function(
																response) {
														},
														failure : function(
																response) {
														}
													});
										});
							} else {
								Ext.Msg.alert("提醒", "*<span style='color:red'>"
												+ item.data.Title
												+ "</span>*提醒时间错过了！",
										function() {
											item.data.IsReminder = true, Ext.Ajax
													.request({
														url : "../../../../security/calender!update",
														params : {
															data : Ext.JSON
																	.encode(item.data)
														},
														method : "POST",
														success : function(
																response) {
														},
														failure : function(
																response) {
														}
													});
										});
							}
						}
					}
				})
			},
			interval : 1000
		}
		Ext.TaskManager.start(task);
		Ext.create('Ext.Viewport', {
			layout : 'border',
			renderTo : 'calendar-ct',
			items : [{
				id : 'app-center',
				title : '...',
				titleAlign : 'center',
				region : 'center',
				layout : 'border',
				listeners : {
					'afterrender' : function() {
						Ext.getCmp('app-center').header
								.addCls('app-center-header');
					}
				},
				items : [{
					id : 'app-west',
					region : 'west',
					width : 179,
					border : false,
					items : [{
						xtype : 'datepicker',
						id : 'app-nav-picker',
						cls : 'ext-cal-nav-picker',
						todayText : '今天',
						ariaTitleDateFormat : 'Y-m-d',
						monthYearFormat : 'Y年m月',
						listeners : {
							'select' : {
								fn : function(dp, dt) {
									Ext.getCmp('app-calendar').setStartDate(dt);
								},
								scope : this
							}
						}
					}, {

					}]
				}, {
					xtype : 'calendarpanel',
					eventStore : eventStore,
					calendarStore : this.calendarStore,
					border : false,
					id : 'app-calendar',
					region : 'center',
					activeItem : 2, // month view

					monthViewCfg : {
						showHeader : true,
						showWeekLinks : true,
						showWeekNumbers : true
					},

					listeners : {
						'eventclick' : {
							fn : function(vw, rec, el) {
								this.showEditWindow(rec, el);
								this.clearMsg();
							},
							scope : this
						},
						'eventover' : function(vw, rec, el) {
							// console.log('Entered evt rec='+rec.data.Title+',
							// view='+ vw.id +', el='+el.id);
						},
						'eventout' : function(vw, rec, el) {
							// console.log('Leaving evt rec='+rec.data.Title+',
							// view='+ vw.id +', el='+el.id);
						},
						'eventadd' : {
							fn : function(cp, rec) {
								this.showMsg('事件：  ' + rec.data.Title
										+ ' 已经添加！');
							},
							scope : this
						},
						'eventupdate' : {
							fn : function(cp, rec) {
								this.updateInfo(rec);
								this.showMsg('事件：  ' + rec.data.Title
										+ ' 已经修改！');
							},
							scope : this
						},
						'eventcancel' : {
							fn : function(cp, rec) {
							},
							scope : this
						},
						'viewchange' : {
							fn : function(p, vw, dateInfo) {
								if (this.editWin) {
									this.editWin.hide();
								}
								if (dateInfo) {
									Ext.getCmp('app-nav-picker')
											.setValue(dateInfo.activeDate);
									this.updateTitle(dateInfo.viewStart,
											dateInfo.viewEnd);
								}
							},
							scope : this
						},
						'dayclick' : {
							fn : function(vw, dt, ad, el) {

								this.showEditWindow({
											StartDate : dt,
											IsAllDay : ad
										}, el);
								this.clearMsg();
							},
							scope : this
						},
						'rangeselect' : {
							fn : function(win, dates, onComplete) {
								this.showEditWindow(dates);
								this.editWin.on('hide', onComplete, this, {
											single : true
										});
								this.clearMsg();
							},
							scope : this
						},
						'eventmove' : {
							fn : function(vw, rec) {
								var mappings = Ext.calendar.data.EventMappings, time = rec.data[mappings.IsAllDay.name]
										? ''
										: ' \\a\\t H:i A';

								this.updateInfo(rec);
							},
							scope : this
						},
						'eventresize' : {
							fn : function(vw, rec) {
								// TODO 这是？
								// rec.commit();
							},
							scope : this
						},
						'eventdelete' : {
							fn : function(win, rec) {
								try {
									var str = rec.data.EventId;
									if (str.indexOf('Ext', 0) >=0) {
										Ext.Msg
												.alert("提示",
														"<span style='color:red'>请在刷新后再删除！</span>");
									}
								} catch (e) {
									eventStore.remove(rec);
									eventStore.sync();
								}
							},
							scope : this
						},
						'initdrag' : {
							fn : function(vw) {
								if (this.editWin && this.editWin.isVisible()) {
									this.editWin.hide();
								}
							},
							scope : this
						}
					}
				}]
			}]
		});
	},

	showEditWindow : function(rec, animateTarget) {
		if (!this.editWin) {
			this.editWin = Ext.create('Ext.calendar.form.EventWindow', {
				calendarStore : this.calendarStore,
				listeners : {
					'eventadd' : {
						fn : function(win, rec) {
							win.hide();
							rec.data.IsNew = true;
							rec.data.IsReminder = false;
							eventStore.add(rec);
							eventStore.sync();

						},
						scope : this
					},
					'eventupdate' : {
						fn : function(win, rec) {
							win.hide();
							this.updateInfo(rec)
						},
						scope : this
					},
					'eventdelete' : {
						fn : function(win, rec) {
							try {
								var str = rec.data.EventId;
								if (str.indexOf('Ext', 0) >= 0) {
									Ext.Msg
											.alert("提示",
													"<span style='color:red'>请在刷新后再删除！</span>");
								}
							} catch (e) {
								eventStore.remove(rec);
								eventStore.sync();
							}

							win.hide();
						},
						scope : this
					},
					'editdetails' : {
						fn : function(win, rec) {
							win.hide();
							Ext.getCmp('app-calendar').showEditForm(rec);
						}
					}
				}
			});
		}
		this.editWin.show(rec, animateTarget);
	},

	updateTitle : function(startDt, endDt) {
		var p = Ext.getCmp('app-center'), fmt = Ext.Date.format;

		if (Ext.Date.clearTime(startDt).getTime() == Ext.Date.clearTime(endDt)
				.getTime()) {
			p.setTitle(fmt(startDt, 'Y-m-d H:i:s A'));
		} else if (startDt.getFullYear() == endDt.getFullYear()) {
			if (startDt.getMonth() == endDt.getMonth()) {
				p.setTitle(fmt(startDt, 'Y-m-d H:i:s A') + ' 至 '
						+ fmt(endDt, 'Y-m-d H:i:s A'));
			} else {
				p.setTitle(fmt(startDt, 'Y-m-d g:i:s A') + ' 至 '
						+ fmt(endDt, 'Y-m-d H:i:s A'));
			}
		} else {
			p.setTitle(fmt(startDt, 'Y-m-d g:i:s A') + ' 至 '
					+ fmt(endDt, 'Y-m-d H:i:s A'));
		}
	},
	updateInfo : function(rec) {
		Ext.Ajax.request({
					url : "../../../../security/calender!update",
					params : {
						data : Ext.JSON.encode(rec.data)
					},
					method : "POST",
					success : function(res) {
						if (res.responseText == 'false') {
							Ext.Msg.alert("提示",
									"<span style='color:red'>请在刷新后再更改！</span>");
						} else {
							rec.commit();
							Ext.Msg.alert("提示", "数据更新成功！");
						}
					},
					failure : function(response) {
						Ext.Msg.alert("提示",
								"<span style='color:red'>数据更新失败，请稍后再试！</span>");
					}
				});
	},
	showMsg : function(msg) {
		Ext.fly('app-msg').update(msg).removeCls('x-hidden');
	},
	clearMsg : function() {
		Ext.fly('app-msg').update('').addCls('x-hidden');
	},

	checkScrollOffset : function() {
		var scrollbarWidth = Ext.getScrollbarSize
				? Ext.getScrollbarSize().width
				: Ext.getScrollBarWidth();

		if (scrollbarWidth < 3) {
			Ext.getBody().addCls('x-no-scrollbar');
		}
		if (Ext.isWindows) {
			Ext.getBody().addCls('x-win');
		}
	}
}, function() {

	Ext.form.Basic.override({
				reset : function() {
					var me = this;
					// This causes field events to be ignored. This is a problem
					// for the
					// DateTimeField since it relies on handling the all-day
					// checkbox state
					// changes to refresh its layout. In general, this batching
					// is really not
					// needed -- it was an artifact of pre-4.0 performance
					// issues and can be removed.
					// me.batchLayouts(function() {
					me.getFields().each(function(f) {
								f.reset();
							});
					// });
					return me;
				}
			});

		// Currently MemoryProxy really only functions for read-only data. Since
		// we
		// want
		// to simulate CRUD transactions we have to at the very least allow them
		// to
		// be
		// marked as completed and successful, otherwise they will never filter
		// back
		// to the
		// UI components correctly.
		/*
		 * Ext.data.MemoryProxy.override({ updateOperation : function(operation,
		 * callback, scope) { operation.setCompleted();
		 * operation.setSuccessful(); Ext.callback(callback, scope || me,
		 * [operation]); }, create : function() {
		 * this.updateOperation.apply(this, arguments); }, update : function() {
		 * this.updateOperation.apply(this, arguments); }, destroy : function() {
		 * this.updateOperation.apply(this, arguments); } });
		 */
	});