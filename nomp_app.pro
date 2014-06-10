#-------------------------------------------------
#
# Project created by QtCreator 2014-06-08T16:13:50
#
#-------------------------------------------------

QT       += core gui

greaterThan(QT_MAJOR_VERSION, 4): QT += widgets

TARGET = nomp_app
TEMPLATE = app

INCLUDEPATH += src

SOURCES += main.cpp\
       src/mainwindow.cpp

HEADERS  += src/mainwindow.h \
    src/util.h

FORMS    += mainwindow.ui
