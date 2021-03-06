package com.soft.process.utils;

import java.io.InputStream;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.activiti.engine.impl.bpmn.parser.BpmnParse;
import org.activiti.engine.impl.persistence.entity.ProcessDefinitionEntity;
import org.activiti.engine.impl.pvm.PvmTransition;
import org.activiti.engine.impl.pvm.process.ActivityImpl;
import org.activiti.engine.impl.pvm.process.TransitionImpl;

/**
 * Class to generate an image based the diagram interchange information in a
 * BPMN 2.0 process.
 * 
 * @author Joram Barrez
 */
public class ActiviDiagram {

	protected static final Map<String, ActivityDrawInstruction> activityDrawInstructions = new HashMap<String, ActivityDrawInstruction>();

	// The instructions on how to draw a certain construct is
	// created statically and stored in a map for performance.
	static {
		// start event
		activityDrawInstructions.put("startEvent",
				new ActivityDrawInstruction() {

					public void draw(ActiviDrawing processDiagramCreator,
							ActivityImpl activityImpl) {
						processDiagramCreator.drawNoneStartEvent(
								activityImpl.getX(), activityImpl.getY(),
								activityImpl.getWidth(),
								activityImpl.getHeight());
					}
				});

		// start timer event
		activityDrawInstructions.put("startTimerEvent",
				new ActivityDrawInstruction() {

					public void draw(ActiviDrawing processDiagramCreator,
							ActivityImpl activityImpl) {
						processDiagramCreator.drawTimerStartEvent(
								activityImpl.getX(), activityImpl.getY(),
								activityImpl.getWidth(),
								activityImpl.getHeight());
					}
				});

		// end event
		activityDrawInstructions.put("endEvent", new ActivityDrawInstruction() {

			public void draw(ActiviDrawing processDiagramCreator,
					ActivityImpl activityImpl) {
				processDiagramCreator.drawNoneEndEvent(activityImpl.getX(),
						activityImpl.getY(), activityImpl.getWidth(),
						activityImpl.getHeight());
			}
		});

		// error end event
		activityDrawInstructions.put("errorEndEvent",
				new ActivityDrawInstruction() {

					public void draw(ActiviDrawing processDiagramCreator,
							ActivityImpl activityImpl) {
						processDiagramCreator.drawErrorEndEvent(
								activityImpl.getX(), activityImpl.getY(),
								activityImpl.getWidth(),
								activityImpl.getHeight());
					}
				});

		// task
		activityDrawInstructions.put("task", new ActivityDrawInstruction() {

			public void draw(ActiviDrawing processDiagramCreator,
					ActivityImpl activityImpl) {
				processDiagramCreator.drawTask(
						(String) activityImpl.getProperty("name"),
						activityImpl.getX(), activityImpl.getY(),
						activityImpl.getWidth(), activityImpl.getHeight());
			}
		});

		// user task
		activityDrawInstructions.put("userTask", new ActivityDrawInstruction() {

			public void draw(ActiviDrawing processDiagramCreator,
					ActivityImpl activityImpl) {
				processDiagramCreator.drawUserTask(
						(String) activityImpl.getProperty("name"),
						activityImpl.getX(), activityImpl.getY(),
						activityImpl.getWidth(), activityImpl.getHeight());
			}
		});

		// script task
		activityDrawInstructions.put("scriptTask",
				new ActivityDrawInstruction() {

					public void draw(ActiviDrawing processDiagramCreator,
							ActivityImpl activityImpl) {
						processDiagramCreator.drawScriptTask(
								(String) activityImpl.getProperty("name"),
								activityImpl.getX(), activityImpl.getY(),
								activityImpl.getWidth(),
								activityImpl.getHeight());
					}
				});

		// service task
		activityDrawInstructions.put("serviceTask",
				new ActivityDrawInstruction() {

					public void draw(ActiviDrawing processDiagramCreator,
							ActivityImpl activityImpl) {
						processDiagramCreator.drawServiceTask(
								(String) activityImpl.getProperty("name"),
								activityImpl.getX(), activityImpl.getY(),
								activityImpl.getWidth(),
								activityImpl.getHeight());
					}
				});

		// receive task
		activityDrawInstructions.put("receiveTask",
				new ActivityDrawInstruction() {

					public void draw(ActiviDrawing processDiagramCreator,
							ActivityImpl activityImpl) {
						processDiagramCreator.drawReceiveTask(
								(String) activityImpl.getProperty("name"),
								activityImpl.getX(), activityImpl.getY(),
								activityImpl.getWidth(),
								activityImpl.getHeight());
					}
				});

		// send task
		activityDrawInstructions.put("sendTask", new ActivityDrawInstruction() {

			public void draw(ActiviDrawing processDiagramCreator,
					ActivityImpl activityImpl) {
				processDiagramCreator.drawSendTask(
						(String) activityImpl.getProperty("name"),
						activityImpl.getX(), activityImpl.getY(),
						activityImpl.getWidth(), activityImpl.getHeight());
			}
		});

		// manual task
		activityDrawInstructions.put("manualTask",
				new ActivityDrawInstruction() {

					public void draw(ActiviDrawing processDiagramCreator,
							ActivityImpl activityImpl) {
						processDiagramCreator.drawManualTask(
								(String) activityImpl.getProperty("name"),
								activityImpl.getX(), activityImpl.getY(),
								activityImpl.getWidth(),
								activityImpl.getHeight());
					}
				});

		// exclusive gateway
		activityDrawInstructions.put("exclusiveGateway",
				new ActivityDrawInstruction() {

					public void draw(ActiviDrawing processDiagramCreator,
							ActivityImpl activityImpl) {
						processDiagramCreator.drawExclusiveGateway(
								activityImpl.getX(), activityImpl.getY(),
								activityImpl.getWidth(),
								activityImpl.getHeight());
					}
				});

		// inclusive gateway
		activityDrawInstructions.put("inclusiveGateway",
				new ActivityDrawInstruction() {

					public void draw(ActiviDrawing processDiagramCreator,
							ActivityImpl activityImpl) {
						processDiagramCreator.drawInclusiveGateway(
								activityImpl.getX(), activityImpl.getY(),
								activityImpl.getWidth(),
								activityImpl.getHeight());
					}
				});

		// parallel gateway
		activityDrawInstructions.put("parallelGateway",
				new ActivityDrawInstruction() {

					public void draw(ActiviDrawing processDiagramCreator,
							ActivityImpl activityImpl) {
						processDiagramCreator.drawParallelGateway(
								activityImpl.getX(), activityImpl.getY(),
								activityImpl.getWidth(),
								activityImpl.getHeight());
					}
				});

		// Boundary timer
		activityDrawInstructions.put("boundaryTimer",
				new ActivityDrawInstruction() {

					public void draw(ActiviDrawing processDiagramCreator,
							ActivityImpl activityImpl) {
						processDiagramCreator.drawCatchingTimerEvent(
								activityImpl.getX(), activityImpl.getY(),
								activityImpl.getWidth(),
								activityImpl.getHeight());
					}
				});

		// Boundary catch error
		activityDrawInstructions.put("boundaryError",
				new ActivityDrawInstruction() {

					public void draw(ActiviDrawing processDiagramCreator,
							ActivityImpl activityImpl) {
						processDiagramCreator.drawCatchingErroEvent(
								activityImpl.getX(), activityImpl.getY(),
								activityImpl.getWidth(),
								activityImpl.getHeight());
					}
				});

		// timer catch event
		activityDrawInstructions.put("intermediateTimer",
				new ActivityDrawInstruction() {

					public void draw(ActiviDrawing processDiagramCreator,
							ActivityImpl activityImpl) {
						processDiagramCreator.drawCatchingTimerEvent(
								activityImpl.getX(), activityImpl.getY(),
								activityImpl.getWidth(),
								activityImpl.getHeight());
					}
				});

		// subprocess
		activityDrawInstructions.put("subProcess",
				new ActivityDrawInstruction() {

					public void draw(ActiviDrawing processDiagramCreator,
							ActivityImpl activityImpl) {
						Boolean isExpanded = (Boolean) activityImpl
								.getProperty(BpmnParse.PROPERTYNAME_ISEXPANDED);
						if (isExpanded != null && isExpanded == false) {
							processDiagramCreator.drawCollapsedSubProcess(
									(String) activityImpl.getProperty("name"),
									activityImpl.getX(), activityImpl.getY(),
									activityImpl.getWidth(),
									activityImpl.getHeight());
						} else {
							processDiagramCreator.drawExpandedSubProcess(
									(String) activityImpl.getProperty("name"),
									activityImpl.getX(), activityImpl.getY(),
									activityImpl.getWidth(),
									activityImpl.getHeight());
						}
					}
				});

		// call activity
		activityDrawInstructions.put("callActivity",
				new ActivityDrawInstruction() {

					public void draw(ActiviDrawing processDiagramCreator,
							ActivityImpl activityImpl) {
						processDiagramCreator.drawCollapsedCallActivity(
								(String) activityImpl.getProperty("name"),
								activityImpl.getX(), activityImpl.getY(),
								activityImpl.getWidth(),
								activityImpl.getHeight());
					}
				});

	}

	/**
	 * Generates a PNG diagram image of the given process definition, using the
	 * diagram interchange information of the process.
	 */
	public static InputStream generatePngDiagram(
			ProcessDefinitionEntity processDefinition) {
		return generateDiagram(processDefinition, "png",
				Collections.<String> emptyList());
	}

	/**
	 * Generates a JPG diagram image of the given process definition, using the
	 * diagram interchange information of the process.
	 */
	public static InputStream generateJpgDiagram(
			ProcessDefinitionEntity processDefinition) {
		return generateDiagram(processDefinition, "jpg",
				Collections.<String> emptyList());
	}

	protected static ActiviDrawing generateDiagram(
			ProcessDefinitionEntity processDefinition,
			List<String> highLightedActivities) {
		ActiviDrawing MyDrawing = initMyDrawing(processDefinition);
		for (ActivityImpl activity : processDefinition.getActivities()) {
			drawActivity(MyDrawing, activity, highLightedActivities);

		}
		return MyDrawing;
	}

	protected static ActiviDrawing generateDiagram(
			ProcessDefinitionEntity processDefinition,
			List<String> highLightedActivities,
			List<String> highLightedHistoryActivities
			) {
		ActiviDrawing MyDrawing = initMyDrawing(processDefinition);
		for (ActivityImpl activity : processDefinition.getActivities()) {
			drawActivity(MyDrawing, activity, highLightedActivities,
					highLightedHistoryActivities);

		}
		return MyDrawing;
	}

	public static InputStream generateDiagram(
			ProcessDefinitionEntity processDefinition, String imageType,
			List<String> highLightedActivities) {
		return generateDiagram(processDefinition, highLightedActivities)
				.generateImage(imageType);
	}

	public static InputStream generateDiagram(
			ProcessDefinitionEntity processDefinition, String imageType,
			List<String> highLightedActivities,
			List<String> highLighteHistorydActivities) {
		return generateDiagram(processDefinition, highLightedActivities,
				highLighteHistorydActivities).generateImage(
				imageType);
	}

	protected static void drawActivity(ActiviDrawing MyDrawing,
			ActivityImpl activity, List<String> highLightedActivities,
			List<String> highLightedHistoryActivities) {
		String type = (String) activity.getProperty("type");
		ActivityDrawInstruction drawInstruction = activityDrawInstructions
				.get(type);
		if (drawInstruction != null) {

			drawInstruction.draw(MyDrawing, activity);

			// Gather info on the multi instance marker
			boolean multiInstanceSequential = false, multiInstanceParallel = false, collapsed = false;
			String multiInstance = (String) activity
					.getProperty("multiInstance");
			if (multiInstance != null) {
				if ("sequential".equals(multiInstance)) {
					multiInstanceSequential = true;
				} else {
					multiInstanceParallel = true;
				}
			}

			// Gather info on the collapsed marker
			Boolean expanded = (Boolean) activity
					.getProperty(BpmnParse.PROPERTYNAME_ISEXPANDED);
			if (expanded != null) {
				collapsed = !expanded;
			}

			// Actually draw the markers
			MyDrawing.drawActivityMarkers(activity.getX(), activity.getY(),
					activity.getWidth(), activity.getHeight(),
					multiInstanceSequential, multiInstanceParallel, collapsed);

		}

		// Outgoing transitions of activity
		for (PvmTransition sequenceFlow : activity.getIncomingTransitions()) {
			// System.out.println(sequenceFlow.getDestination().getId()+"seqF");
			List<Integer> waypoints = ((TransitionImpl) sequenceFlow)
					.getWaypoints();
			for (int i = 2; i < waypoints.size(); i += 2) { // waypoints.size()
															// minimally 4: x1,
															// y1,
															// x2, y2
					// System.out.println(sequenceFlow.getId()+"=======getCurrentID");
					boolean drawConditionalIndicator = (i == 2)
							&& sequenceFlow
									.getProperty(BpmnParse.PROPERTYNAME_CONDITION) != null
							&& !((String) activity.getProperty("type"))
									.toLowerCase().contains("gateway");
					if (i < waypoints.size() - 2) {
						MyDrawing.drawSequenceflowWithoutArrow(
								waypoints.get(i - 2), waypoints.get(i - 1),
								waypoints.get(i), waypoints.get(i + 1),
								drawConditionalIndicator);
					} else {
						MyDrawing.drawSequenceflow(waypoints.get(i - 2),
								waypoints.get(i - 1), waypoints.get(i),
								waypoints.get(i + 1), drawConditionalIndicator);
					}
			}
		}
		// Draw highlighted activities
		if (highLightedHistoryActivities.contains(activity.getId())) {
			drawHighLightHistory(MyDrawing, activity);
		}
		if (highLightedActivities.contains(activity.getId())) {
			drawHighLight(MyDrawing, activity);
		}
		// Nested activities (boundary events)
		for (ActivityImpl nestedActivity : activity.getActivities()) {
			drawActivity(MyDrawing, nestedActivity, highLightedActivities);
		}
	}

	protected static void drawActivity(ActiviDrawing MyDrawing,
			ActivityImpl activity, List<String> highLightedActivities) {
		String type = (String) activity.getProperty("type");
		ActivityDrawInstruction drawInstruction = activityDrawInstructions
				.get(type);
		if (drawInstruction != null) {

			drawInstruction.draw(MyDrawing, activity);

			// Gather info on the multi instance marker
			boolean multiInstanceSequential = false, multiInstanceParallel = false, collapsed = false;
			String multiInstance = (String) activity
					.getProperty("multiInstance");
			if (multiInstance != null) {
				if ("sequential".equals(multiInstance)) {
					multiInstanceSequential = true;
				} else {
					multiInstanceParallel = true;
				}
			}

			// Gather info on the collapsed marker
			Boolean expanded = (Boolean) activity
					.getProperty(BpmnParse.PROPERTYNAME_ISEXPANDED);
			if (expanded != null) {
				collapsed = !expanded;
			}

			// Actually draw the markers
			MyDrawing.drawActivityMarkers(activity.getX(), activity.getY(),
					activity.getWidth(), activity.getHeight(),
					multiInstanceSequential, multiInstanceParallel, collapsed);

			// Draw highlighted activities
			if (highLightedActivities.contains(activity.getId())) {
				drawHighLight(MyDrawing, activity);
			}

		}

		// Outgoing transitions of activity
		for (PvmTransition sequenceFlow : activity.getIncomingTransitions()) {
			List<Integer> waypoints = ((TransitionImpl) sequenceFlow)
					.getWaypoints();
			for (int i = 2; i < waypoints.size(); i += 2) { // waypoints.size()
															// minimally 4: x1,
															// y1,
															// x2, y2
				boolean drawConditionalIndicator = (i == 2)
						&& sequenceFlow
								.getProperty(BpmnParse.PROPERTYNAME_CONDITION) != null
						&& !((String) activity.getProperty("type"))
								.toLowerCase().contains("gateway");
				if (i < waypoints.size() - 2) {
					MyDrawing.drawSequenceflowWithoutArrow(
							waypoints.get(i - 2), waypoints.get(i - 1),
							waypoints.get(i), waypoints.get(i + 1),
							drawConditionalIndicator);
				} else {
					MyDrawing.drawSequenceflow(waypoints.get(i - 2),
							waypoints.get(i - 1), waypoints.get(i),
							waypoints.get(i + 1), drawConditionalIndicator);
				}
			}
		}

		// Nested activities (boundary events)
		for (ActivityImpl nestedActivity : activity.getActivities()) {
			drawActivity(MyDrawing, nestedActivity, highLightedActivities);
		}
	}

	private static void drawHighLight(ActiviDrawing MyDrawing, ActivityImpl activity) {
		MyDrawing.drawHighLight(activity.getX(), activity.getY(),
				activity.getWidth(), activity.getHeight());
	}

	private static void drawHighLightHistory(ActiviDrawing MyDrawing,
			ActivityImpl activity) {
		MyDrawing.drawHighLightHistory(activity.getX(), activity.getY(),
				activity.getWidth(), activity.getHeight());
	}

	protected static ActiviDrawing initMyDrawing(
			ProcessDefinitionEntity processDefinition) {
		int minX = Integer.MAX_VALUE;
		int maxX = 0;
		int minY = Integer.MAX_VALUE;
		int maxY = 0;

		for (ActivityImpl activity : processDefinition.getActivities()) {

			// width
			if (activity.getX() + activity.getWidth() > maxX) {
				maxX = activity.getX() + activity.getWidth();
			}
			if (activity.getX() < minX) {
				minX = activity.getX();
			}
			// height
			if (activity.getY() + activity.getHeight() > maxY) {
				maxY = activity.getY() + activity.getHeight();
			}
			if (activity.getY() < minY) {
				minY = activity.getY();
			}

			for (PvmTransition sequenceFlow : activity.getOutgoingTransitions()) {
				List<Integer> waypoints = ((TransitionImpl) sequenceFlow)
						.getWaypoints();
				for (int i = 0; i < waypoints.size(); i += 2) {
					// width
					if (waypoints.get(i) > maxX) {
						maxX = waypoints.get(i);
					}
					if (waypoints.get(i) < minX) {
						minX = waypoints.get(i);
					}
					// height
					if (waypoints.get(i + 1) > maxY) {
						maxY = waypoints.get(i + 1);
					}
					if (waypoints.get(i + 1) < minY) {
						minY = waypoints.get(i + 1);
					}
				}
			}
		}
		return new ActiviDrawing(maxX + 10, maxY + 10, minX, minY);
	}

	protected interface ActivityDrawInstruction {

		void draw(ActiviDrawing processDiagramCreator, ActivityImpl activityImpl);

	}

}
