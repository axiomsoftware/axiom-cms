#!/bin/bash

ruby cms-build.rb

rsync --exclude=".bzr" --delete -avr cms-enterprise/* ../cms-enterprise-build
rsync --exclude=".bzr" --delete -avr cms-standard/* ../cms-standard-build

cd ../cms-enterprise-build
bzr add
bzr commit -m "enterprise autobuild"
cd ../cms-standard-build
bzr add
bzr commit -m "standard autobuild" # bzr test
 # bzr test number 2
