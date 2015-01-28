/**
 * Created by erinci on 27.01.2015.
 */
// Mage Console Page - Button onClick Events =============================================================
/**
 * Tail latest log button
 */
$("#tailLatestLog").click(function() {
    // Check if any project is selected
    var selectedId = $('#activeProject').val();
    if (selectedId == 'null') {
        toastr.warning("Please select an active project first", 'MagePanel Console');
        $('#viewFileModal').modal('hide');
        return;
    }

    // Find latest log file and tail it
    if (selectedId != null) {
        $.get( '/mageLogs/projectLatestLog?id=' + selectedId, function(logJson) {
            if (logJson != 'null') {
                if (logJson["status"] == "success") {
                    $('#viewFileModal').modal('show');
                    // TODO: Fix mixing of tail log and tail console sockets
                    tailLogFile(logJson.logFile, logJson.logDate, logJson.logTime);
                }else{
                    toastr.warning(logJson["message"], 'MagePanel Logs');
                }
            } else {
                toastr.error('There was a problem getting latest log file', 'MagePanel Logs');
            }
        });
    } else {
        // Selected project ID is invalid
        toastr.error('There was a problem getting latest log file', 'MagePanel Logs');
    }
});

/**
 * Clear console button
 */
$("#clearConsole").click(function() {
    $('#console').html("<span class='console-pointer'>&gt;&gt; </span><i>Ready..</i><br>");
});

/**
 * Mage Version button
 */
$("#mageinfo").click(function() {
    cmdQueue.enqueue({ projectId: $('#activeProject').find(":selected").val(), cmd: 'version' });
    appendToConsole();
});

/**
 * List Mage Releases button
 */
$("#mageReleases").click(function() {
    var selectedId = $('#activeProject').find(":selected").val();
    var selectedEnv = $('#activeEnvironment').val();

    // Add list releases command to queue
    var cmd = 'releases list to:' + selectedEnv;
    cmdQueue.enqueue({ projectId: selectedId, cmd: cmd });
    appendToConsole();
});

/**
 * Mage Deploy Button
 */
$("#mageDeploy").click(function() {
    var selectedId = $('#activeProject').find(":selected").val();
    var selectedEnv = $('#activeEnvironment').val();

    if(confirm("Do you really want to deploy to " + selectedEnv + " ?")) {
        // Add deploy command to queue
        var cmd = 'deploy to:' + selectedEnv;
        cmdQueue.enqueue({ projectId: selectedId, cmd: cmd });
        appendToConsole();
    }
});

/**
 * Mage Rollback Button
 */
$("#mageRollback").click(function() {
    var selectedId = $('#activeProject').find(":selected").val();
    var selectedItem = $('#activeRelease option:selected');
    var selectedItemVal = selectedItem.val();
    var selectedItemText = selectedItem.text();
    var selectedEnvironment = $('#activeEnvironment').val();
    // Cancel if selection is not valid
    if (selectedItem == 'null') {
        toastr.warning("Please select an active release", 'MagePanel Console');
        return;
    }

    if(confirm("Do you really want to rollback to " + selectedItemText + " release?")) {
        // Add list releases command to queue
        var cmd = 'releases rollback --release=' + selectedItemVal + " to:" + selectedEnvironment;
        cmdQueue.enqueue({ projectId: selectedId, cmd: cmd });
        appendToConsole();
    }
});

/**
 * Add to Deploy Workflow button
 */
var workflowPanel = null;
$("#mageAddToFlow").click(function() {
    // Check if panel already exists
    if (workflowPanel == null) {
        // Prepare content
        var content = "<p class='clearfix'></p>";

        // Create jsPanel
        workflowPanel = $.jsPanel({
            size:           { width: 260, height: 450 },
            position:       { top: 240, right: 120 },
            title:          "Workflow",
            autoclose:      false,
            overflow:       { horizontal: 'hidden', vertical: 'auto' },
            bootstrap:      'info',
            controls:       { close: 'disable', maximize: 'disable' },
            content:        function() { return content; },
            toolbarFooter:  [
                {
                    item:     "<button type='button' />",
                    event:    "click",
                    btnclass: "btn btn-sm btn-danger ion-close",
                    btntext:  " Cancel",
                    callback: function( event ){
                        // Reset state
                        workflowPanel.close();
                        workflowPanel = null;
                        cmdQueue = new Queue();
                    }
                },
                {
                    item:     "<button type='button' />",
                    event:    "click",
                    btnclass: "btn btn-sm btn-success ion-paper-airplane",
                    btntext:  " Start Flow",
                    callback: function(event){
                        if(confirm("Do you really want to execute workflow?")) {
                            $("#clearConsole").trigger('click');
                            appendToConsole();
                        }
                    }
                }
            ]
        });
    }

    // Add command to existing workflow
    var selectedProjectId = $('#activeProject').find(":selected").val();
    var selectedProjectName = $('#activeProject').find(":selected").text();
    var selectedEnv = $('#activeEnvironment').find(":selected").val();
    workflowPanel.content.append(
            "<h4 style='text-align: center;'>" +
                "<span class='label label-success'>" +
                    selectedProjectName +
                    "&nbsp;&nbsp;<span class='ion-arrow-right-c'></span>&nbsp;&nbsp;" +
                    selectedEnv +
                "</span>" +
            "</h4>"
    );
    var deployCmd = 'deploy to:' + selectedEnv;
    cmdQueue.enqueue({ projectId: selectedProjectId, cmd: deployCmd });
});

// Projects Page - Button onClick Events =============================================================
/**
 * Project Page Button Click Events
 */
$("#applyFileBtn").click(function() {
    // Get current form data
    var formData = {
        orgFile: $("#orgFile").val(),
        code: codeMirror.getValue()
    };

    $.post( '/projects/applyFile', formData, function(result) {
        // Check if we have warning
        if(result["warn"]) {
            toastr.warning(result["message"], 'MagePanel Projects');
        } else {
            toastr.success(result["message"], 'MagePanel Projects');
        }
    }).error(function() {
        toastr.error('Something went wrong ', 'MagePanel Projects');
    });
});

/**
 * Delete project button onClick
 */
$('#delProjectBtn').on('click', function() {
    var selectedItem = $('.list-group-item.active')[0];

    // Cancel if selection is not valid
    if (selectedItem == null) {
        toastr.warning("Select a project first", 'MagePanel Projects');
        return;
    }

    // Confirm project deletion
    if(confirm("Are you sure to delete project?")) {
        // jQuery AJAX call for project deletion
        $.post( '/projects/delete?id=' + selectedItem.id, function(result) {
            // Check if we have warning
            if(result["warn"]) {
                toastr.warning(result["message"], 'MagePanel Projects');
            } else {
                $('#projectsList').load(document.URL +  ' #projectsList');
                $('#projectDetail').html("Select a project..");
                toggleProjectsPageButtons('off', null); // disable buttons
                toastr.success(result["message"], 'MagePanel Projects');
            }
        }).error(function() {
            toastr.error('Something went wrong ', 'MagePanel Projects');
        });
    }
});

/**
 * Refresh project button onClick
 */
$('#refreshProjectBtn').on('click', function() {
    var selectedItem = $('.list-group-item.active')[0];

    // Cancel if selection is not valid
    if (selectedItem == null) {
        toastr.warning("Select a project first", 'MagePanel Projects');
        return;
    }

    // jQuery AJAX call for project refresh
    $.post( '/projects/refresh?id=' + selectedItem.id, function(result) {
        // Check if we have warning
        if(result["warn"]) {
            toastr.warning(result["message"], 'MagePanel Projects');
        } else {
            $('#'+selectedItem.id).trigger("click");
            toastr.success(result["message"], 'MagePanel Projects');
        }
    }).error(function() {
        toastr.error('Something went wrong ', 'MagePanel Projects');
    });
});

/**
 * GIT Pull project button onClick
 */
$('#gitPullProjectBtn').on('click', function() {
    var selectedItem = $('.list-group-item.active')[0];

    // Cancel if selection is not valid
    if (selectedItem == null) {
        toastr.warning("Select a project first", 'MagePanel Projects');
        return;
    }

    // jQuery AJAX call for project refresh
    $.post( '/projects/gitPull?id=' + selectedItem.id, function(result) {
        // Check if we have warning
        if(result["warn"]) {
            toastr.warning(result["message"], 'MagePanel Projects');
        } else {
            $('#'+selectedItem.id).trigger("click");
            $('#refreshProjectBtn').trigger("click");
            toastr.success(result["message"], 'MagePanel Projects');
        }
    }).error(function() {
        toastr.error('Something went wrong ', 'MagePanel Projects');
    });
});

/**
 * GIT Switch Branch button onClick
 */
$('#gitSwitchBranchProjectBtn').on('click', function() {
    // TODO: Adjust popover content style

    var selectedItem = $('.list-group-item.active')[0];
    el = $(this);

    $.post( '/projects/gitRemoteBranches?id=' + selectedItem.id, function(result) {
        var content_header = '<form class="form-inline" id="switchGitBranchForm" role="form" style="width:400px"><div class="form-group">' +
            '<select id="switchBranchPicker" name="newBranchName" data-width="160px" data-size="8" class="selectpicker">';
        var content_footer = '</select> <button class="btn btn-primary" id="switchToSelectedBranchBtn" type="button" onclick="switchGitBranch(switchBranchPicker.value);">Switch &raquo;</button>' +
            '</div></form><script type="text/javascript">$(\'#switchBranchPicker\').selectpicker(\'refresh\');</script>';
        var options = '';
        var branches = result["message"];
        $.each(branches, function(i, val) {
            options += '<option data-icon="ion-fork-repo">' + val + '</option>';
        });
        var content = content_header + options + content_footer;

        //el.unbind('click').popover({
        el.popover({
            content: content,
            title: 'Switch Branch',
            html: true,
            delay: {show: 400, hide: 100}
        }).popover('show');
    });
});

// Mage Logs Page - Button onClick Events =============================================================

/**
 * Pause & Resume Tail file buttons onClick Events
 */
$("#pauseTailFileBtn").click(function() {
    logSocket.emit('pauseTail', {});
    $('#pauseTailFileBtn').hide();
    $('#resumeTailFileBtn').show();
});
$("#resumeTailFileBtn").click(function() {
    logSocket.emit('resumeTail', {});
    $('#pauseTailFileBtn').show();
    $('#resumeTailFileBtn').hide();
});
