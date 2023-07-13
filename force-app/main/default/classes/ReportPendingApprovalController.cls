public class ReportPendingApprovalController {
	private final string GROUP_A_APPROVALS = 'Pending A Approval';
	private final string GROUP_B_APPROVALS = 'Pending B Approval';
	private final string GROUP_QA_APPROVALS = 'Pending QA Approval';
	private final string GROUP_DISTRIBUTION_APPROVALS = 'Pending Distribution Approval';

    public ReportPendingApprovalController() {
	}

    @AuraEnabled
	public ApprovalOppDT getbuildApprovalQueueData() {
        ApprovalOppDT wrap = new ApprovalOppDT();
		Set<Id> oppIds = new Set<Id>();
		Set<Id> processIds = new Set<Id>();
        
		//Query process work items and build opp id array
		List<ProcessInstanceWorkitem> workitems = [SELECT 
														ActorId, 
														Id, 
														IsDeleted, 
														OriginalActorId, 
														ProcessInstanceId, 
														Actor.Name, 
														OriginalActor.Name, 
														ProcessInstance.Status, 
														ProcessInstance.TargetObjectId 
													FROM 
														ProcessInstanceWorkitem
													WHERE
														IsDeleted = false
														AND ActorId =: UserInfo.getUserId() 
													ORDER BY
														SystemModStamp desc];
		
		Map<Id, ProcessInstanceWorkitem> workItemMap = new Map<Id, ProcessInstanceWorkitem>();
		
		for (ProcessInstanceWorkitem wi : workitems) {
			string oppId = wi.ProcessInstance.TargetObjectId;
			
			if (oppId.startsWith('006')) {
				oppIds.add(oppId);
				processIds.add(wi.ProcessInstanceId);
				
				workItemMap.put(oppId, wi);
			}
		}
		
		Map<Id, ProcessInstanceStep> mapSteps = new Map<Id, ProcessInstanceStep>();
		for (List<ProcessInstanceStep> steps : [SELECT ActorId, Actor.Name, Id, ProcessInstanceId, SystemModStamp FROM ProcessInstanceStep WHERE ProcessInstanceId IN :processIds ORDER BY ProcessInstanceId, SystemModStamp DESC]) {
			for (ProcessInstanceStep step : steps) {
				if(!mapSteps.containsKey(step.ProcessInstanceId)) {
					mapSteps.put(step.ProcessInstanceId, step); 
				}
			}
		}
		
        List<Opportunity> listOpps = [SELECT 
										Name,
										A_Notes_Approved__c, 
										AccountId, 
										B_Notes_Approved__c, 
										Id, 
										In_Review__c, 
										Priority__c, 
										QA_Approved__c, 
										Approval_Status__c,
										Report_Merge_Approved__c, 
										Service_Date_Thru__c, 
										Account.Name,
										RecordTypeId,
                                      	Recordtype.Developername
									FROM 
										Opportunity
									WHERE
										Id IN :oppIds
									ORDER BY
										Priority__c DESC,
										Service_Date_Thru__c];
        
        for (Opportunity opp : listOpps) {
			if (opp.Approval_Status__c == GROUP_A_APPROVALS) {
				wrap.AApprovals.add(opp);
			}
			else if (opp.Approval_Status__c == GROUP_B_APPROVALS && opp.Recordtype.Developername !='Case_Note_Activity_Only') {
				wrap.BApprovals.add(opp);
			}
			else if (opp.Approval_Status__c == GROUP_QA_APPROVALS) {
				wrap.QAApprovals.add(opp);
			}
			else if (opp.Approval_Status__c == GROUP_DISTRIBUTION_APPROVALS) {
				wrap.DistributionApprovals.add(opp);
			}
			else {
				wrap.AApprovals.add(opp);
			}
		}
        System.debug('@@	wrap------'+wrap);
        return wrap;
	}

    public class ApprovalOppDT {
        List <Opportunity> AApprovals;
        List <Opportunity> BApprovals;
        List <Opportunity> QAApprovals;
        List <Opportunity> DistributionApprovals;
    } 
}