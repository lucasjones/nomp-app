#include "mainwindow.h"
#include "ui_mainwindow.h"

MainWindow::MainWindow(QWidget *parent) :
    QMainWindow(parent),
    ui(new Ui::MainWindow)
{
    ui->setupUi(this);
    ui->poolList->setModel(&poolList);
    poolList << "Test pool - http://127.0.0.1/";
}

MainWindow::~MainWindow()
{
    delete ui;
}
