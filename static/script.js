$(document).ready(function () {
    var addTask = function () {
        var parent = $(this).closest('li');
        var descr = "";
        var parent_id = null;
        var parent_element = $("#tasks-ul");

        if (parent.length != 0) {
            descr = parent.find(".taskdescr").val();
            parent_id = parent.attr('data-task-id');
            parent_element = parent.find('ul');
        } else {
            descr = $('#taskdescr').val();
        }

        if (!descr || !descr.trim()) {
            alert("Нельзя добавить задачу без описания!");
            return;
        }

        var str = '{"Method": "Add", "Param": { "task_title": "' + descr + '", "parent": ' + parent_id + ' } }';

        descr = descr.substr(0, 400);

        $.post("http://todo-list.ru/ajax/", str, function (data) {
            if (data.Data !== null && data.Data.task_id !== null) {
                var tid = data.Data.task_id;
                var li = undefined;

                if (!parent_id) {

                    li = $($('#taskTemplate').html());

                    li.attr('data-task-id', tid);
                    li.find('.taskCheckbox')[0].id = tid;
                    li.find('.taskTitle').text(descr);

                    li.find('.taskCheckbox').click(doneTask);
                    li.find(".add-btn").click(addTask);

                } else {

                    var li = $($('#subtaskTemplate').html());

                    li.find('.taskCheckbox')[0].id = tid;
                    li.find('.taskTitle').text(descr);

                }

                parent_element.append(li);

                var el = $('#' + tid);
                el.click(function () {
                    if ($(this).is(':checked')) {
                        $(this).prop('disabled', true);

                        var str = '{"Method": "Check", "Param": { "task_id": "' + this.id + '" } }';

                        $($(this).closest('li')[0]).addClass('done');

                        $.post("http://todo-list.ru/ajax/", str, function (data) {
                            if (data.Data == true) {
                                $(this).prop('disabled', true);
                            }
                        });

                    }
                });
            }
        });
    };

    var doneTask = function () {
        if ($(this).is(':checked')) {
            $(this).prop('disabled', true);

            var str = '{"Method": "Check", "Param": { "task_id": "' + this.id + '" } }';

            var doneCheckbox = $($(this).closest('li')[0]);
            doneCheckbox.addClass('done');

            doneCheckbox.find('input[type=checkbox]').prop('checked', true);
            doneCheckbox.find('input[type=checkbox]').prop('disabled', true);

            $.post("http://todo-list.ru/ajax/", str, function (data) {
                if (data.Data == true) {
                    $(this).prop('disabled', true);
                }
            });

        }
    };

    $(".add-btn").click(addTask);

    $('input[type=checkbox]').click(doneTask);
});

$(function () {
    $('[data-toggle="tooltip"]').tooltip()
});

function shareClick() {
    copyToClipboard(document.getElementById("copyToClipInput"));
};

function newListClick() {
    var uuid = generateUUID();
    var newLocation = 'http://todo-list.ru/' + uuid;
    window.location.href = newLocation;
};

function copyToClipboard(elem) {
    // create hidden text element, if it doesn't already exist
    var targetId = "_hiddenCopyText_";
    var isInput = elem.tagName === "INPUT" || elem.tagName === "TEXTAREA";
    var origSelectionStart, origSelectionEnd;
    if (isInput) {
        // can just use the original source element for the selection and copy
        target = elem;
        origSelectionStart = elem.selectionStart;
        origSelectionEnd = elem.selectionEnd;
    } else {
        // must use a temporary form element for the selection and copy
        target = document.getElementById(targetId);
        if (!target) {
            var target = document.createElement("textarea");
            target.style.position = "absolute";
            target.style.left = "-9999px";
            target.style.top = "0";
            target.id = targetId;
            document.body.appendChild(target);
        }
        target.textContent = elem.textContent;
    }
    // select the content
    var currentFocus = document.activeElement;
    target.focus();
    target.setSelectionRange(0, target.value.length);

    // copy the selection
    var succeed;
    try {
        succeed = document.execCommand("copy");
    } catch (e) {
        succeed = false;
    }
    // restore original focus
    //if (currentFocus && typeof currentFocus.focus === "function") {
    //    currentFocus.focus();
    //}

    //if (isInput) {
    //    // restore prior selection
    //    elem.setSelectionRange(origSelectionStart, origSelectionEnd);
    //} else {
    //    // clear temporary content
    //    target.textContent = "";
    //}
    return succeed;
};

function generateUUID() {
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
};
