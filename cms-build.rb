require 'pp'
require 'find'
require 'fileutils'
require 'English'
include FileUtils::Verbose

# ./CMSTask
# ./CMSTaskContainer
# ./static/axiom/widget/TaskTable.js       

enterprise_files = %w{ 
./ContentManagementSystem/task_functions.js 
./ContentManagementSystem/tasks_nav.tal
./ContentManagementSystem/tasks_content.tal
./ContentManagementSystem/task_email.tal
./ContentManagementSystem/report_functions.js
./ContentManagementSystem/reports_content.tal
./ContentManagementSystem/reports_nav.tal
./ContentManagementSystem/tree.js
./static/axiom/widget/AddTaskModal.js

./static/axiom/widget/PendingTaskTable.js
./static/axiom/widget/resources/PendingTaskTable.css
./static/axiom/widget/resources/PendingTaskTable.html
./static/axiom/widget/ClosedTaskTable.js
./static/axiom/widget/resources/ClosedTaskTable.css
./static/axiom/widget/resources/ClosedTaskTable.html
./static/axiom/widget/OpenTaskTable.js
./static/axiom/widget/resources/OpenTaskTable.css
./static/axiom/widget/resources/OpenTaskTable.html
./static/axiom/widget/SearchTaskTable.js
./static/axiom/widget/resources/SearchTaskTable.css
./static/axiom/widget/resources/SearchTaskTable.html
./static/axiom/widget/TaskAdd.js
./static/axiom/widget/resources/TaskAdd.css
./static/axiom/widget/resources/TaskAdd.html
./static/axiom/reports.js
./static/axiom/widget/resources/ReportGenerator.html
./static/axiom/widget/resources/ReportGenerator.css
./static/axiom/widget/ReportGenerator.js
}

def clean_dir(dir)
  begin
    rm_r dir if File.directory?  dir
    mkdir dir
  rescue Exception => e
    puts "Couldn't clean #{dir}"
  end
end

def preprocess(lines, version)
  skip = false
  lines.map! do |line|
    case line
    when /if-cms-version-([\w\|]+)/
      skip = !($LAST_PAREN_MATCH.index(version))
      nil
    when /end-cms-if/
      skip = false
      nil
    else
      line if not skip
    end
  end
  lines.flatten
end

def copy_tree_entry(path, dest, version)
  return if path == '.'
  file = File.join(dest, path)
  if File.directory? path
    begin
      mkdir file
    rescue Exception => e
      puts "Couldn't create #{file} - probably already exists or permissions are wrong"
    end
  else
    File.open(file, 'w').write(preprocess(File.open(path).readlines, version).join)
  end
end

clean_dir 'cms-enterprise'
clean_dir 'cms-standard'

Find.find('.') do |file|
  if file =~ /\.svn|\.bzr|cms-(standard|workgroup|enterprise)/ || (ARGV[0] == '-ns' && file =~/dojo|ext-2.1|FCKeditor/)
    Find.prune 
  end
  
  enterprise = enterprise_files.member? file 

  if not (enterprise)
    copy_tree_entry(file, 'cms-standard', 'standard')
  end
  copy_tree_entry(file, 'cms-enterprise', 'enterprise')
  
end
