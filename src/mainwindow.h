#ifndef MAINWINDOW_H
#define MAINWINDOW_H

#include "util.h"

#include <QMainWindow>
#include <QItemSelection>

namespace Ui {
class MainWindow;
}

class MainWindow : public QMainWindow
{
    Q_OBJECT

public:
    explicit MainWindow(QWidget *parent = 0);
    ~MainWindow();

public slots:
    void poolSelectionChanged(QItemSelection current, QItemSelection previous);
    void keySelectionChanged(QItemSelection current, QItemSelection previous);

private:
    Ui::MainWindow *ui;
    StringList poolList;
    StringList keyList;
};

#endif // MAINWINDOW_H
