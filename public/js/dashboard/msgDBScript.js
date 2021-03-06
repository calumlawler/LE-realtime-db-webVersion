var consumerKey = 0;
var accountNum = 0;
var consumerSecret = 0;
var accessToken = 0;
var accessTokenSecret = 0;
var msgConskillSelect = 1;
var msgConskillIDList = null;
var msgConagentIDList = null;
var msgConAgentSelect = 1;
var msgConRange = 1;
var msgcsatskillSelect = 1;
var msgcsatskillIDList = null;
var msgcsatagentIDList = null;
var msgcsatAgentSelect = 1;
var msgcsatRange = 1;
getLocalStorageVariables();
var showData = false;
var showData2 = false;

var limit = 100;
var agentActivityRange = 1;
var conFrom = 60; //# mins
var conFromLong = 10080; //# mins
var skillIDListAA = "all";
// variable for the list of agents
var agentList = null;

var ctx = document.getElementById("lineChart").getContext("2d");
var ctx2 = document.getElementById("lineChart24hr").getContext("2d");
var data = {
    labels: ["Answer 5", "Answer 4", "Answer 3", "Answer 2", "Answer 1"],
    datasets: [{
        label: "My First dataset",
        fillColor: "#03586A",
        strokeColor: "#03586A",
        highlightFill: "#4e8a96",
        highlightStroke: "#4e8a96",
        data: [65, 59, 80, 81, 56]
    }]
};
var data2 = {
    labels: ["CCP", "Consumer", "System"],
    datasets: [{
        label: "My First dataset",
        fillColor: "#03586A",
        strokeColor: "#03586A",
        highlightFill: "#4e8a96",
        highlightStroke: "#4e8a96",
        data: [65, 59, 80]
    }]
};
var myLineChart = new Chart(ctx).Bar(data, {
    responsive: true,
    animation: false
});
var myPieChart = new Chart(ctx2).Bar(data2, {
    responsive: true,
    animation: false
});

$(document).ready(function () {
    $('#lineChart').hide();
    $('#lineChart24hr').hide();
    //setup the agent status table
    $('#agentStatusTable').DataTable({
        "initComplete": function (settings) {
            /* Apply the tooltips */
            $('#agentStatusTable thead th[title]').tooltip({
                "container": 'body'
            });
        },
        aLengthMenu: [
            [10, 25, 50, 100, -1],
            [10, 25, 50, 100, "All"]
        ]
    });
    //setup the skill status table
    $('#skillStatusTable').DataTable({
        "initComplete": function (settings) {
            /* Apply the tooltips */
            $('#skillStatusTable thead th[title]').tooltip({
                "container": 'body'
            });
        },
        aLengthMenu: [
            [10, 25, 50, 100, -1],
            [10, 25, 50, 100, "All"]
        ]
    });
    setTimeout(function () {
        var sel = 'div[role="main"]';
        agentList = angular.element(sel).scope().listUsers();
        skillList = angular.element(sel).scope().listSkills();
        agentGroupList = angular.element(sel).scope().listGroups();
        getData();
    }, 100);
});



function getData() {
    $.ajax({
        type: 'GET',
        url: '/messagingConversation?cKey=' + consumerKey + '&accNum=' + accountNum + '&cSec=' + consumerSecret + '&tok=' + accessToken + '&tSec=' + accessTokenSecret + '&skill=' + msgConskillIDList + '&skS=' + msgConskillSelect + '&agent=' + msgConagentIDList + '&agS=' + msgConAgentSelect + '&range=' + msgConRange,
        success: function (data) {
            if (data.Fail != "undefined" && data.Fail != "404") {
                updateMessagingConData(data);
            } else {
                //window.location.href = "/error";
                $('#myModal2').modal('show');
                $('#errorDetails').html(JSON.stringify(data.Error));
            }
        }
    });
    $.ajax({
        type: 'GET',
        url: '/conversations?cKey=' + consumerKey + '&accNum=' + accountNum + '&cSec=' + consumerSecret + '&tok=' + accessToken + '&tSec=' + accessTokenSecret + '&offset=' + conFrom + '&limit=' + limit,
        success: function (data) {
            if (data.Fail != "undefined" && data.Fail != "404") {
                updateConversationsData(data);
            } else {
                //window.location.href = "/error";
                $('#myModal2').modal('show');
                $('#errorDetails').html(JSON.stringify(data.Error));
            }
        }
    });
    $.ajax({
        type: 'GET',
        url: '/agentActivity?cKey=' + consumerKey + '&accNum=' + accountNum + '&cSec=' + consumerSecret + '&tok=' + accessToken + '&tSec=' + accessTokenSecret + '&range=' + agentActivityRange + '&skill=' + skillIDListAA,
        success: function (data) {
            if (data.Fail != "undefined" && data.Fail != "404") {
                updateAgentActivityData(data);
            } else {
                //window.location.href = "/error";
                $('#myModal2').modal('show');
                $('#errorDetails').html(JSON.stringify(data.Error));
            }
        }
    });
    $.ajax({
        type: 'GET',
        url: '/messagingCSAT?cKey=' + consumerKey + '&accNum=' + accountNum + '&cSec=' + consumerSecret + '&tok=' + accessToken + '&tSec=' + accessTokenSecret + '&skill=' + msgcsatskillIDList + '&skS=' + msgcsatskillSelect + '&agent=' + msgcsatagentIDList + '&agS' + msgcsatAgentSelect + '&range=' + msgcsatRange,
        success: function (data) {
            if (data.Fail != "undefined" && data.Fail != "404") {
                updateMessagingCSATData(data);
            } else {
                //window.location.href = "/error";
                $('#myModal2').modal('show');
                $('#errorDetails').html(JSON.stringify(data.Error));
            }
        }
    });
    $.ajax({
        type: 'GET',
        url: '/conversations?cKey=' + consumerKey + '&accNum=' + accountNum + '&cSec=' + consumerSecret + '&tok=' + accessToken + '&tSec=' + accessTokenSecret + '&offset=' + conFromLong + '&limit=' + limit + '&messStatus=OPEN',
        success: function (data) {
            if (data.Fail != "undefined" && data.Fail != "404") {
                updateConversationsOpenData(data);
            } else {
                //window.location.href = "/error";
                $('#myModal2').modal('show');
                $('#errorDetails').html(JSON.stringify(data.Error));
            }
        }
    });


}

function getLocalStorageVariables() {
    // Check browser support
    if (typeof (Storage) !== "undefined") {
        consumerKey = localStorage.getItem("consumerKeyM");
        accountNum = localStorage.getItem("accountNumM");
        consumerSecret = localStorage.getItem("consumerSecretM");
        accessToken = localStorage.getItem("accessTokenM");
        accessTokenSecret = localStorage.getItem("accessTokenSecretM");
        msgConskillSelect = localStorage.getItem("msgConskillSelect");
        msgConskillIDList = localStorage.getItem("msgConskillIDList");
        msgConagentIDList = localStorage.getItem("msgConagentIDList");
        msgConAgentSelect = localStorage.getItem("msgConAgentSelect");
        msgConRange = localStorage.getItem("msgConRange");
        msgcsatskillSelect = localStorage.getItem("msgcsatskillSelect");
        msgcsatskillIDList = localStorage.getItem("msgcsatskillIDList");
        msgcsatagentIDList = localStorage.getItem("msgcsatagentIDList");
        msgcsatAgentSelect = localStorage.getItem("msgcsatAgentSelect");
        msgcsatRange = localStorage.getItem("msgcsatRange");
    } else {
        console.log("Sorry, your browser does not support Web Storage...");
    }
    return;
}

function updateAgentActivityData(data) {
    var agentsOnline = 0;
    var agentsAway = 0;
    var agentsBackSoon = 0;
    var agentsLoggedIn = 0;
    for (var agent in data.agentsMetrics.metricsPerAgent) {
        // data available for each agent in the 
        var agentID = null;
        if (agentList.hasOwnProperty(agent)) {
            agentID = agentList[agent].nickname;
        } else {
            agentID = agent;
        }
        if (data.agentsMetrics.metricsPerAgent[agent][0].value.total !== 0) agentsOnline += 1;
        if (data.agentsMetrics.metricsPerAgent[agent][2].value.total !== 0) agentsAway += 1;
        if (data.agentsMetrics.metricsPerAgent[agent][1].value.total !== 0) agentsBackSoon += 1;
        if (data.agentsMetrics.metricsPerAgent[agent][3].value.total !== 0) agentsLoggedIn += 1;
    }
    $('#onlineAgents').html(agentsOnline);
    $('#awayAgents').html(agentsAway);
    $('#backAgents').html(agentsBackSoon);
    $('#loggedInAgents').html(agentsLoggedIn);

    return;
}


function updateConversationsData(data) {
    var conInbound = 0;
    var conOutbound = 0;
    var countInfo = 0;
    var countMessages = 0;
    var avgResByAgent = 0;
    var avgActiveByAgent = 0;
    var minTimeAgent = 2000000000000;
    var minTimeCons = 2000000000000;
    var prevMessageId = "";
    var currMessageId = "";
    var minTimeUpdated = false;
    var countRespondedMessages = 0;
    var totalResponseTime = 0;
    var avgResponseTime = 0;
    var avgMessagePerConversation = 0;
    var countAgentsClosed = [];
    var countAgentsOpen = [];
    var checkForAgent = false;
    var messageRecTime = 2000000000000;
    var messageResTime = 2000000000000;
    var messageResTime2 = 2000000000000;
    var totalMessageResponseTime = 0;
    var avgMessageResponseTime = 0;
    var countAgentRespondedMessages = 0;
    var prevSender = "";

    var obj = JSON.parse(data);
    if (obj.hasOwnProperty("conversationHistoryRecords")) {
        for (var conversations in obj.conversationHistoryRecords) {
            if (obj.conversationHistoryRecords[conversations].hasOwnProperty("info")) {
                countInfo += 1;
                if (obj.conversationHistoryRecords[conversations].info.hasOwnProperty("status")) {
                    if (JSON.stringify(obj.conversationHistoryRecords[conversations].info.status) == "\"OPEN\"") {
                        if (JSON.stringify(obj.conversationHistoryRecords[conversations].info.latestQueueState) == "\"ACTIVE\"") {
                            countAgentsOpen.push(obj.conversationHistoryRecords[conversations].info.latestAgentId);
                        }
                    }
                    if (JSON.stringify(obj.conversationHistoryRecords[conversations].info.status) == "\"CLOSE\"") {
                        countAgentsClosed.push(obj.conversationHistoryRecords[conversations].info.latestAgentId);
                    }
                }
            }
            if (obj.conversationHistoryRecords[conversations].hasOwnProperty("messageRecords")) {
                for (var message in obj.conversationHistoryRecords[conversations].messageRecords) {
                    countMessages += 1;
                    currMessageId = (JSON.stringify(obj.conversationHistoryRecords[conversations].messageRecords[message].messageId).split("::"))[1];
                    if (currMessageId != prevMessageId) {
                        prevMessageId = currMessageId;
                        // Reset min time...
                        minTimeCons = 2000000000000;
                        minTimeAgent = 2000000000000;
                        messageRecTime = 2000000000000;
                        checkForAgent = false;
                        prevSender = "";
                    }
                    minTimeUpdated = false;
                    if (obj.conversationHistoryRecords[conversations].messageRecords[message].hasOwnProperty("sentBy")) {
                        if (JSON.stringify(obj.conversationHistoryRecords[conversations].messageRecords[message].sentBy) == "\"Consumer\"") {
                            conInbound += 1;
                            if (obj.conversationHistoryRecords[conversations].messageRecords[message].timeL < minTimeCons) {
                                minTimeCons = obj.conversationHistoryRecords[conversations].messageRecords[message].timeL;
                                minTimeUpdated = true;
                            }
                            if (prevSender !== "Consumer") {
                                if (obj.conversationHistoryRecords[conversations].messageRecords[message].timeL < messageRecTime) {
                                    messageRecTime = obj.conversationHistoryRecords[conversations].messageRecords[message].timeL;
                                }
                                checkForAgent = true;
                                prevSender = "Consumer";
                            }
                        }
                        if (JSON.stringify(obj.conversationHistoryRecords[conversations].messageRecords[message].sentBy) == "\"Agent\"") {
                            conOutbound += 1;
                            if (obj.conversationHistoryRecords[conversations].messageRecords[message].timeL < minTimeAgent) {
                                minTimeAgent = obj.conversationHistoryRecords[conversations].messageRecords[message].timeL;
                                minTimeUpdated = true;
                            }
                            if (prevSender !== "Agent") {
                                if (checkForAgent) {
                                    messageResTime = obj.conversationHistoryRecords[conversations].messageRecords[message].timeL;
                                    if (messageRecTime < messageResTime) {
                                        totalMessageResponseTime += messageResTime - messageRecTime;
                                        countAgentRespondedMessages += 1;
                                    }
                                }
                                prevSender = "Agent";
                                checkForAgent = false;
                            } else if (prevSender === "Agent") {
                                messageResTime2 = obj.conversationHistoryRecords[conversations].messageRecords[message].timeL;
                                if (messageResTime < messageResTime2) {
                                    totalMessageResponseTime += messageResTime2 - messageResTime;
                                    countAgentRespondedMessages += 1;
                                }
                            }
                        }
                    }
                    if ((minTimeCons != 2000000000000) && (minTimeAgent != 2000000000000) && minTimeUpdated) {
                        totalResponseTime += minTimeAgent - minTimeCons;
                        countRespondedMessages += 1;
                    }
                }
            }
        }
    }

    // Average the number of closed conversations per rep
    var count = {};
    countAgentsClosed.forEach(function (x) { count[x] = (count[x] || 0) + 1; });
    var agentCount = 0;
    var closedCount = 0;
    Object.keys(count).forEach(function (key) {
        agentCount++;
        closedCount += count[key];
    });

    if (agentCount != 0) {
        avgResByAgent = (closedCount / agentCount).toFixed(2);
    }

    // Average the number of Active conversations per rep
    var count1 = {};
    countAgentsOpen.forEach(function (x) { count1[x] = (count1[x] || 0) + 1; });
    agentCount = 0;
    var openCount = 0;
    Object.keys(count1).forEach(function (key) {
        agentCount++;
        openCount += count1[key];
    });

    if (agentCount != 0) {
        avgActiveByAgent = (openCount / agentCount).toFixed(2);
    }

    // CRT - average time to agent response to consumer message 
    if (countInfo != 0) {
        avgMessagePerConversation = (countMessages / countInfo).toFixed(2);
        avgMessageResponseTime = secondsToHms((totalMessageResponseTime / countInfo) / 1000);
        if (avgMessageResponseTime < 0) avgMessageResponseTime = 0;
    }

    // ASA - time to first agent response
    if (countRespondedMessages != 0) {
        avgResponseTime = secondsToHms((totalResponseTime / countRespondedMessages) / 1000);
        if (avgResponseTime < 0) avgResponseTime = 0;
    }

    /*// CRT - average time to agent response to consumer message 
    if (countAgentRespondedMessages != 0) {
        avgMessageResponseTime = secondsToHms((totalMessageResponseTime / countAgentRespondedMessages) / 1000);
        if (avgMessageResponseTime < 0) avgMessageResponseTime = 0;
    }*/

    $('#conOutbound').html(conOutbound);
    $('#conInbound').html(conInbound);
    $('#avgConResByAgent').html(avgResByAgent);
    $('#aveActiveConAgent').html(avgActiveByAgent);
    $('#numMessages').html(avgMessagePerConversation);
    $('#firstResponseTime').html(avgResponseTime);
    $('#avgHandlingTime').html(avgMessageResponseTime);
}

function updateConversationsOpenData(data) {
    var conTotal = 0;
    var conActive = 0;
    var conInQueue = 0;

    var obj = JSON.parse(data);
    if (obj.hasOwnProperty("conversationHistoryRecords")) {
        for (var conversations in obj.conversationHistoryRecords) {
            if (obj.conversationHistoryRecords[conversations].hasOwnProperty("info")) {
                if (obj.conversationHistoryRecords[conversations].info.hasOwnProperty("status")) {
                    if (JSON.stringify(obj.conversationHistoryRecords[conversations].info.status) == "\"OPEN\"") {
                        conTotal += 1;
                        if (JSON.stringify(obj.conversationHistoryRecords[conversations].info.latestQueueState) == "\"ACTIVE\"") {
                            conActive += 1;
                        }
                        if (JSON.stringify(obj.conversationHistoryRecords[conversations].info.latestQueueState) == "\"IN_QUEUE\"") {
                            conInQueue += 1;
                        }
                    }
                }
            }
        }
    }

    $('#conTotal').html(conTotal);
    $('#conActive').html(conActive);
    $('#conInQueue').html(conInQueue);
}


/**
 * @desc updates the data table and the current queue dashboard with the data from the messaging csat api
 * @param data - JSON Object that is returned from the messaging csat API
 * @return undefined
 */
function updateMessagingConData(data) {
    var skillId = "";
    var agentId = "";
    var avgTime_resolvedConversations = 0;
    var resolvedConversations_byCCP = 0;
    var resolvedConversations_byConsumer = 0;
    var totalResolvedConversations = 0;
    var resolvedConversations_bySystem = 0;
    if (data.hasOwnProperty("metricsTotals")) {
        avgTime_resolvedConversations = data.metricsTotals.avgTime_resolvedConversations;
        resolvedConversations_byCCP = data.metricsTotals.resolvedConversations_byCCP;
        resolvedConversations_byConsumer = data.metricsTotals.resolvedConversations_byConsumer;
        totalResolvedConversations = data.metricsTotals.totalResolvedConversations;
        resolvedConversations_bySystem = data.metricsTotals.resolvedConversations_bySystem;

        avgTime_resolvedConversations = secondsToHms(avgTime_resolvedConversations / 1000);
    }
    if (data.hasOwnProperty("agentsMetrics")) {
        if (data.agentsMetrics.hasOwnProperty("metricsPerAgent")) {
            for (var agent in data.agentsMetrics.metricsPerAgent) {
                skillId = "All";
                if (agentList.hasOwnProperty(agent)) {
                    agentId = agentList[agent].nickname;
                } else {
                    agentId = agent;
                }
                avgTime_resolvedConversations = data.agentsMetrics.metricsPerAgent[agent].avgTime_resolvedConversations;
                resolvedConversations_byCCP = data.agentsMetrics.metricsPerAgent[agent].resolvedConversations_byCCP;
                resolvedConversations_byConsumer = data.agentsMetrics.metricsPerAgent[agent].resolvedConversations_byConsumer;
                totalResolvedConversations = data.agentsMetrics.metricsPerAgent[agent].totalResolvedConversations;
                resolvedConversations_bySystem = data.agentsMetrics.metricsPerAgent[agent].resolvedConversations_bySystem;

                avgTime_resolvedConversations = secondsToHms(avgTime_resolvedConversations / 1000);
            }
        }
        if (data.agentsMetrics.hasOwnProperty("metricsTotals")) {
            avgTime_resolvedConversations = data.agentsMetrics.metricsTotals.avgTime_resolvedConversations;
            resolvedConversations_byCCP = data.agentsMetrics.metricsTotals.resolvedConversations_byCCP;
            resolvedConversations_byConsumer = data.agentsMetrics.metricsTotals.resolvedConversations_byConsumer;;
            totalResolvedConversations = data.agentsMetrics.metricsTotals.totalResolvedConversations;
            resolvedConversations_bySystem = data.agentsMetrics.metricsTotals.resolvedConversations_bySystem;

            avgTime_resolvedConversations = secondsToHms(avgTime_resolvedConversations / 1000);
        }
    }
    if (data.hasOwnProperty("skillsMetricsPerAgent")) {
        if (data.skillsMetricsPerAgent.hasOwnProperty("metricsPerSkill")) {
            for (var skill in data.skillsMetricsPerAgent.metricsPerSkill) {
                if (skillList.hasOwnProperty(skill)) {
                    skillId = skillList[skill];
                } else {
                    if (skill == -1) {
                        skillId = "Unassigned"
                    } else {
                        skillId = skill;
                    }
                }
                if (data.skillsMetricsPerAgent.metricsPerSkill[skill].hasOwnProperty("metricsPerAgent")) {
                    for (var agent in data.skillsMetricsPerAgent.metricsPerSkill[skill].metricsPerAgent) {
                        if (agentList.hasOwnProperty(agent)) {
                            agentId = agentList[agent].nickname;
                        } else {
                            agentId = agent;
                        }
                        avgTime_resolvedConversations = data.skillsMetricsPerAgent.metricsPerSkill[skill].metricsPerAgent[agent].avgTime_resolvedConversations;
                        resolvedConversations_byCCP = data.skillsMetricsPerAgent.metricsPerSkill[skill].metricsPerAgent[agent].resolvedConversations_byCCP;
                        resolvedConversations_byConsumer = data.skillsMetricsPerAgent.metricsPerSkill[skill].metricsPerAgent[agent].resolvedConversations_byConsumer;
                        totalResolvedConversations = data.skillsMetricsPerAgent.metricsPerSkill[skill].metricsPerAgent[agent].totalResolvedConversations;
                        resolvedConversations_bySystem = data.skillsMetricsPerAgent.metricsPerSkill[skill].metricsPerAgent[agent].resolvedConversations_bySystem;

                        avgTime_resolvedConversations = secondsToHms(avgTime_resolvedConversations / 1000);
                    }
                }
                if (data.skillsMetricsPerAgent.metricsPerSkill[skill].hasOwnProperty("metricsTotals")) {
                    agentId = "All";
                    avgTime_resolvedConversations = data.skillsMetricsPerAgent.metricsPerSkill[skill].metricsTotals.avgTime_resolvedConversations;
                    resolvedConversations_byCCP = data.skillsMetricsPerAgent.metricsPerSkill[skill].metricsTotals.resolvedConversations_byCCP;
                    resolvedConversations_byConsumer = data.skillsMetricsPerAgent.metricsPerSkill[skill].metricsTotals.resolvedConversations_byConsumer;
                    totalResolvedConversations = data.skillsMetricsPerAgent.metricsPerSkill[skill].metricsTotals.totalResolvedConversations;
                    resolvedConversations_bySystem = data.skillsMetricsPerAgent.metricsPerSkill[skill].metricsTotals.resolvedConversations_bySystem;

                    avgTime_resolvedConversations = secondsToHms(avgTime_resolvedConversations / 1000);
                }
            }
        }
        if (data.skillsMetricsPerAgent.hasOwnProperty("metricsTotals")) {
            skillId = "All";
            agentId = "All";
            avgTime_resolvedConversations = data.skillsMetricsPerAgent.metricsTotals.avgTime_resolvedConversations;
            resolvedConversations_byCCP = data.skillsMetricsPerAgent.metricsTotals.resolvedConversations_byCCP;
            resolvedConversations_byConsumer = data.skillsMetricsPerAgent.metricsTotals.resolvedConversations_byConsumer;
            totalResolvedConversations = data.skillsMetricsPerAgent.metricsTotals.totalResolvedConversations;
            resolvedConversations_bySystem = data.skillsMetricsPerAgent.metricsTotals.resolvedConversations_bySystem;

            avgTime_resolvedConversations = secondsToHms(avgTime_resolvedConversations / 1000);
        }
    }

    $('#conRes').html(totalResolvedConversations);
    $('#conCCP').html(resolvedConversations_byCCP);
    $('#conCon').html(resolvedConversations_byConsumer);
    $('#avgTime').html(avgTime_resolvedConversations);
    updateLineGraph2(resolvedConversations_bySystem, resolvedConversations_byCCP, resolvedConversations_byConsumer)
}

/**
 * @desc updates the data table and the current queue dashboard with the data from the messaging csat api
 * @param data - JSON Object that is returned from the messaging csat API
 * @return undefined
 */
function updateMessagingCSATData(data) {
    var skillId = "";
    var agentId = "";
    var csatScore = 0;
    var positiveAns = 0;
    var totalAns = 0;
    var csat1 = 0;
    var csat2 = 0;
    var csat3 = 0;
    var csat4 = 0;
    var csat5 = 0;
    if (data.hasOwnProperty("metricsTotals")) {
        csatScore = (data.metricsTotals.csat_score * 100).toFixed(0) + "%";
        positiveAns = data.metricsTotals.positive_answers;
        totalAns = data.metricsTotals.total_answers;
        csat1 = data.metricsTotals.csat_score1_answers;
        csat2 = data.metricsTotals.csat_score2_answers;
        csat3 = data.metricsTotals.csat_score3_answers;
        csat4 = data.metricsTotals.csat_score4_answers;
        csat5 = data.metricsTotals.csat_score5_answers;
    }
    if (data.hasOwnProperty("agentsMetrics")) {
        if (data.agentsMetrics.hasOwnProperty("metricsPerAgent")) {
            for (var agent in data.agentsMetrics.metricsPerAgent) {
                skillId = "All";
                if (agentList.hasOwnProperty(agent)) {
                    agentId = agentList[agent].nickname;
                } else {
                    agentId = agent;
                }
                csatScore = (data.agentsMetrics.metricsPerAgent[agent].csat_score * 100).toFixed(0) + "%";
                positiveAns = data.agentsMetrics.metricsPerAgent[agent].positive_answers;
                totalAns = data.agentsMetrics.metricsPerAgent[agent].total_answers;
                csat1 = data.agentsMetrics.metricsPerAgent[agent].csat_score1_answers;
                csat2 = data.agentsMetrics.metricsPerAgent[agent].csat_score2_answers;
                csat3 = data.agentsMetrics.metricsPerAgent[agent].csat_score3_answers;
                csat4 = data.agentsMetrics.metricsPerAgent[agent].csat_score4_answers;
                csat5 = data.agentsMetrics.metricsPerAgent[agent].csat_score5_answers;
            }
        }
        if (data.agentsMetrics.hasOwnProperty("metricsTotals")) {
            agentId = "All";
            csatScore = (data.agentsMetrics.metricsTotals.csat_score * 100).toFixed(0) + "%";
            positiveAns = data.agentsMetrics.metricsTotals.positive_answers;
            totalAns = data.agentsMetrics.metricsTotals.total_answers;
            csat1 = data.agentsMetrics.metricsTotals.csat_score1_answers;
            csat2 = data.agentsMetrics.metricsTotals.csat_score2_answers;
            csat3 = data.agentsMetrics.metricsTotals.csat_score3_answers;
            csat4 = data.agentsMetrics.metricsTotals.csat_score4_answers;
            csat5 = data.agentsMetrics.metricsTotals.csat_score5_answers;
        }
    }
    if (data.hasOwnProperty("skillsMetricsPerAgent")) {
        if (data.skillsMetricsPerAgent.hasOwnProperty("metricsPerSkill")) {
            for (var skill in data.skillsMetricsPerAgent.metricsPerSkill) {
                if (skillList.hasOwnProperty(skill)) {
                    skillId = skillList[skill];
                } else {
                    if (skill == -1) {
                        skillId = "Unassigned"
                    } else {
                        skillId = skill;
                    }
                }
                if (data.skillsMetricsPerAgent.metricsPerSkill[skill].hasOwnProperty("metricsPerAgent")) {
                    for (var agent in data.skillsMetricsPerAgent.metricsPerSkill[skill].metricsPerAgent) {
                        if (agentList.hasOwnProperty(agent)) {
                            agentId = agentList[agent].nickname;
                        } else {
                            agentId = agent;
                        }
                        csatScore = (data.skillsMetricsPerAgent.metricsPerSkill[skill].metricsPerAgent[agent].csat_score * 100).toFixed(0) + "%";
                        positiveAns = data.skillsMetricsPerAgent.metricsPerSkill[skill].metricsPerAgent[agent].positive_answers;
                        totalAns = data.skillsMetricsPerAgent.metricsPerSkill[skill].metricsPerAgent[agent].total_answers;
                        csat1 = data.skillsMetricsPerAgent.metricsPerSkill[skill].metricsPerAgent[agent].csat_score1_answers;
                        csat2 = data.skillsMetricsPerAgent.metricsPerSkill[skill].metricsPerAgent[agent].csat_score2_answers;
                        csat3 = data.skillsMetricsPerAgent.metricsPerSkill[skill].metricsPerAgent[agent].csat_score3_answers;
                        csat4 = data.skillsMetricsPerAgent.metricsPerSkill[skill].metricsPerAgent[agent].csat_score4_answers;
                        csat5 = data.skillsMetricsPerAgent.metricsPerSkill[skill].metricsPerAgent[agent].csat_score5_answers;
                    }
                }
                if (data.skillsMetricsPerAgent.metricsPerSkill[skill].hasOwnProperty("metricsTotals")) {
                    agentId = "All";
                    csatScore = (data.skillsMetricsPerAgent.metricsPerSkill[skill].metricsTotals.csat_score * 100).toFixed(0) + "%";
                    positiveAns = data.skillsMetricsPerAgent.metricsPerSkill[skill].metricsTotals.positive_answers;
                    totalAns = data.skillsMetricsPerAgent.metricsPerSkill[skill].metricsTotals.total_answers;
                    csat1 = data.skillsMetricsPerAgent.metricsPerSkill[skill].metricsTotals.csat_score1_answers;
                    csat2 = data.skillsMetricsPerAgent.metricsPerSkill[skill].metricsTotals.csat_score2_answers;
                    csat3 = data.skillsMetricsPerAgent.metricsPerSkill[skill].metricsTotals.csat_score3_answers;
                    csat4 = data.skillsMetricsPerAgent.metricsPerSkill[skill].metricsTotals.csat_score4_answers;
                    csat5 = data.skillsMetricsPerAgent.metricsPerSkill[skill].metricsTotals.csat_score5_answers;
                }
            }
        }
        if (data.skillsMetricsPerAgent.hasOwnProperty("metricsTotals")) {
            skillId = "All";
            agentId = "All";
            csatScore = (data.skillsMetricsPerAgent.metricsTotals.csat_score * 100).toFixed(0) + "%";
            positiveAns = data.skillsMetricsPerAgent.metricsTotals.positive_answers;
            totalAns = data.skillsMetricsPerAgent.metricsTotals.total_answers;
            csat1 = data.skillsMetricsPerAgent.metricsTotals.csat_score1_answers;
            csat2 = data.skillsMetricsPerAgent.metricsTotals.csat_score2_answers;
            csat3 = data.skillsMetricsPerAgent.metricsTotals.csat_score3_answers;
            csat4 = data.skillsMetricsPerAgent.metricsTotals.csat_score4_answers;
            csat5 = data.skillsMetricsPerAgent.metricsTotals.csat_score5_answers;
        }
    }
    $('#csatScore').html(csatScore);
    $('#totalAns').html(totalAns);
    $('#posAns').html(positiveAns);
    updateLineGraph(csat5, csat4, csat3, csat2, csat1);
}

function updateLineGraph(d1, d2, d3, d4, d5) {
    //destroy the graphs and populate them with the new data
    myLineChart.destroy();
    // data sets for the graphs
    data = {
        labels: ["Answer 5", "Answer 4", "Answer 3", "Answer 2", "Answer 1"],
        datasets: [{
            label: "My First dataset",
            fillColor: "#03586A",
            strokeColor: "#03586A",
            highlightFill: "#4e8a96",
            highlightStroke: "#4e8a96",
            data: [d1, d2, d3, d4, d5]
        }]
    };
    //if this is the first data pull, then show the graphs
    if (showData == false) {
        $('#lineChart').show();
        showData = true;
        myLineChart = new Chart(ctx).Bar(data, {
            responsive: true,
            animation: false
        });
        myLineChart.datasets[0].bars[0].fillColor = "#03586a"; //bar 1
        myLineChart.datasets[0].bars[1].fillColor = "#024351"; //bar 2
        myLineChart.datasets[0].bars[2].fillColor = "#6a4803"; //bar 3
        myLineChart.datasets[0].bars[3].fillColor = "#DAA520"; //bar 3
        myLineChart.datasets[0].bars[4].fillColor = "#6a1503"; //bar 3
        myLineChart.update();
    } else {
        myLineChart = new Chart(ctx).Bar(data, {
            responsive: true,
            animation: false
        });
        myLineChart.datasets[0].bars[0].fillColor = "#03586a"; //bar 1
        myLineChart.datasets[0].bars[1].fillColor = "#024351"; //bar 2
        myLineChart.datasets[0].bars[2].fillColor = "#6a4803"; //bar 3
        myLineChart.datasets[0].bars[3].fillColor = "#DAA520"; //bar 3
        myLineChart.datasets[0].bars[4].fillColor = "#6a1503"; //bar 3
        myLineChart.update();
    }
}

function updateLineGraph2(d1, d2, d3) {
    myPieChart.destroy();
    data2 = {
        labels: ["CCP", "Consumer", "System"],
        datasets: [{
            label: "My First dataset",
            fillColor: "#03586A",
            strokeColor: "#03586A",
            highlightFill: "#4e8a96",
            highlightStroke: "#4e8a96",
            data: [d2, d3, d1]
        }]
    };
    if (showData2 == false) {
        $('#lineChart24hr').show();
        showData2 = true;
        myPieChart = new Chart(ctx2).Bar(data2, {
            responsive: true,
            animation: false
        });
    } else {
        myPieChart = new Chart(ctx2).Bar(data2, {
            responsive: true,
            animation: false
        });
    }
}