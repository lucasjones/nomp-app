#include "mainwindow.h"
#include <QApplication>
#include <QFontDatabase>
#include <QDebug>
#include <QErrorMessage>

int main(int argc, char *argv[])
{
    QApplication a(argc, argv);

    if(QFontDatabase::addApplicationFont(":/font/fontawesome.otf") < 0) {
        qCritical() << "Failed to load Font Awesome.";
    }
    MainWindow w;
    w.show();

    return a.exec();
}
